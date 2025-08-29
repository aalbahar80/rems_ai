const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { BCRYPT_ROUNDS } = require('../config/environment');

class User {
  constructor(data) {
    this.id = data.user_id;
    this.username = data.username;
    this.email = data.email;
    this.role = data.user_type;
    this.phone = data.phone;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.preferred_language = data.preferred_language;
    this.timezone = data.timezone;
  }

  // Hash password
  static async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(parseInt(BCRYPT_ROUNDS));
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Password comparison failed');
    }
  }

  // Find user by email or username
  static async findByCredential(credential) {
    try {
      const userQuery = `
        SELECT 
          user_id, username, email, password_hash, user_type, 
          phone, is_active, created_at, updated_at, preferred_language, timezone
        FROM rems.users 
        WHERE (email = $1 OR username = $1) AND is_active = true
      `;

      const result = await query(userQuery, [credential]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Database error');
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const userQuery = `
        SELECT 
          user_id, username, email, user_type, phone, 
          is_active, created_at, updated_at, preferred_language, timezone
        FROM rems.users 
        WHERE user_id = $1
      `;

      const result = await query(userQuery, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Database error');
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { username, email, password, role, full_name, phone } = userData;

      // Hash password
      const password_hash = await User.hashPassword(password);

      const insertQuery = `
        INSERT INTO rems.users (
          username, email, password_hash, role, full_name, phone, 
          is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
        RETURNING id, username, email, role, full_name, phone, 
                  is_active, created_at, updated_at
      `;

      const values = [username, email, password_hash, role, full_name, phone];
      const result = await query(insertQuery, values);

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);

      // Handle unique constraint violations
      if (error.code === '23505') {
        if (error.constraint === 'users_email_key') {
          throw new Error('Email already exists');
        }
        if (error.constraint === 'users_username_key') {
          throw new Error('Username already exists');
        }
      }

      throw new Error('User creation failed');
    }
  }

  // Update user
  static async update(id, updateData) {
    try {
      const allowedFields = ['full_name', 'phone', 'email', 'is_active'];
      const updates = [];
      const values = [];
      let paramCount = 1;

      // Build dynamic update query
      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          updates.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const updateQuery = `
        UPDATE rems.users 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, username, email, role, full_name, phone, 
                  is_active, created_at, updated_at
      `;

      const result = await query(updateQuery, values);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('User update failed');
    }
  }

  // Change password
  static async changePassword(id, oldPassword, newPassword) {
    try {
      // Get current password hash
      const currentQuery = `
        SELECT password_hash FROM rems.users WHERE id = $1 AND is_active = true
      `;

      const currentResult = await query(currentQuery, [id]);

      if (currentResult.rows.length === 0) {
        throw new Error('User not found');
      }

      // Verify old password
      const isValidOldPassword = await User.comparePassword(
        oldPassword,
        currentResult.rows[0].password_hash
      );

      if (!isValidOldPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await User.hashPassword(newPassword);

      // Update password
      const updateQuery = `
        UPDATE rems.users 
        SET password_hash = $1, updated_at = NOW()
        WHERE id = $2
      `;

      await query(updateQuery, [newPasswordHash, id]);

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Get all users (admin only)
  static async getAll(filters = {}) {
    try {
      let whereClause = 'WHERE 1=1';
      const values = [];
      let paramCount = 1;

      // Apply filters
      if (filters.role) {
        whereClause += ` AND role = $${paramCount}`;
        values.push(filters.role);
        paramCount++;
      }

      if (filters.is_active !== undefined) {
        whereClause += ` AND is_active = $${paramCount}`;
        values.push(filters.is_active);
        paramCount++;
      }

      const usersQuery = `
        SELECT 
          id, username, email, role, full_name, phone, 
          is_active, created_at, updated_at
        FROM rems.users 
        ${whereClause}
        ORDER BY created_at DESC
      `;

      const result = await query(usersQuery, values);

      return result.rows.map((row) => new User(row));
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Failed to retrieve users');
    }
  }

  // Validate user data
  static validateUserData(data, isUpdate = false) {
    const errors = [];

    // Username validation (required for new users)
    if (!isUpdate && !data.username) {
      errors.push('Username is required');
    } else if (
      data.username &&
      (data.username.length < 3 || data.username.length > 50)
    ) {
      errors.push('Username must be between 3 and 50 characters');
    }

    // Email validation (required for new users)
    if (!isUpdate && !data.email) {
      errors.push('Email is required');
    } else if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    // Password validation (required for new users)
    if (!isUpdate && !data.password) {
      errors.push('Password is required');
    } else if (data.password && data.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Role validation
    const validRoles = [
      'admin',
      'property_manager',
      'owner',
      'tenant',
      'vendor',
    ];
    if (!isUpdate && !data.role) {
      errors.push('Role is required');
    } else if (data.role && !validRoles.includes(data.role)) {
      errors.push(`Role must be one of: ${validRoles.join(', ')}`);
    }

    // Full name validation
    if (!isUpdate && !data.full_name) {
      errors.push('Full name is required');
    } else if (data.full_name && data.full_name.length > 100) {
      errors.push('Full name must be less than 100 characters');
    }

    // Phone validation (optional)
    if (data.phone && !/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
      errors.push('Invalid phone number format');
    }

    return errors;
  }

  // Convert to safe object (without sensitive data)
  toSafeObject() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      full_name: this.full_name,
      phone: this.phone,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = User;
