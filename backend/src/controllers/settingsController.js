const { query } = require('../config/database');

/**
 * System Settings Controller - Configuration management
 * Based on comprehensive database documentation
 */

// Get all system settings
const getAllSettings = async (req, res) => {
  try {
    const category = req.query.category || 'all';
    const publicOnly = req.query.public_only === 'true';

    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    // Category filter
    if (category !== 'all') {
      whereClause += ` AND category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    // Public settings only (for non-admin users)
    if (publicOnly || req.user.user_type !== 'admin') {
      whereClause += ` AND is_public = true`;
    }

    const settingsQuery = `
      SELECT 
        setting_id,
        setting_key,
        setting_value,
        setting_type,
        category,
        description,
        is_public,
        requires_restart,
        validation_rule,
        default_value,
        updated_by,
        created_at,
        updated_at
      FROM rems.system_settings
      ${whereClause}
      ORDER BY category ASC, setting_key ASC
    `;

    const result = await query(settingsQuery, queryParams);

    // Parse setting values based on type
    const settings = result.rows.map((setting) => ({
      ...setting,
      parsed_value: parseSettingValue(
        setting.setting_value,
        setting.setting_type
      ),
    }));

    // Group by category
    const groupedSettings = settings.reduce((acc, setting) => {
      const cat = setting.category || 'uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(setting);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        settings: groupedSettings,
        total: settings.length,
        categories: Object.keys(groupedSettings),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get all settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve settings',
    });
  }
};

// Get setting by key
const getSettingByKey = async (req, res) => {
  try {
    const settingKey = req.params.key;

    const settingQuery = `
      SELECT 
        setting_id,
        setting_key,
        setting_value,
        setting_type,
        category,
        description,
        is_public,
        requires_restart,
        validation_rule,
        default_value,
        updated_by,
        created_at,
        updated_at
      FROM rems.system_settings
      WHERE setting_key = $1
    `;

    const result = await query(settingQuery, [settingKey]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found',
      });
    }

    const setting = result.rows[0];

    // Check if user can access this setting
    if (!setting.is_public && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied to private setting',
      });
    }

    res.json({
      success: true,
      data: {
        ...setting,
        parsed_value: parseSettingValue(
          setting.setting_value,
          setting.setting_type
        ),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get setting by key error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve setting',
    });
  }
};

// Create or update setting
const updateSetting = async (req, res) => {
  try {
    const settingKey = req.params.key;
    const {
      setting_value,
      setting_type = 'string',
      category,
      description,
      is_public = false,
      requires_restart = false,
      validation_rule,
      default_value,
    } = req.body;

    // Validation
    if (setting_value === undefined || setting_value === null) {
      return res.status(400).json({
        success: false,
        error: 'setting_value is required',
      });
    }

    // Validate setting type
    const validTypes = [
      'string',
      'integer',
      'decimal',
      'boolean',
      'json',
      'array',
    ];
    if (!validTypes.includes(setting_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid setting_type',
        valid_types: validTypes,
      });
    }

    // Validate setting value against type
    const validationResult = validateSettingValue(setting_value, setting_type);
    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid setting value for type',
        details: validationResult.error,
      });
    }

    // Convert value to appropriate string format
    const stringValue = convertToStringValue(setting_value, setting_type);

    // Check if setting exists
    const existingSetting = await query(
      'SELECT setting_id FROM rems.system_settings WHERE setting_key = $1',
      [settingKey]
    );

    let result;

    if (existingSetting.rows.length > 0) {
      // Update existing setting
      const updateQuery = `
        UPDATE rems.system_settings
        SET 
          setting_value = $1,
          setting_type = $2,
          category = $3,
          description = $4,
          is_public = $5,
          requires_restart = $6,
          validation_rule = $7,
          default_value = $8,
          updated_by = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE setting_key = $10
        RETURNING *
      `;

      result = await query(updateQuery, [
        stringValue,
        setting_type,
        category,
        description,
        is_public,
        requires_restart,
        validation_rule,
        default_value,
        req.user.user_id,
        settingKey,
      ]);

      res.json({
        success: true,
        message: 'Setting updated successfully',
        data: {
          ...result.rows[0],
          parsed_value: parseSettingValue(
            result.rows[0].setting_value,
            result.rows[0].setting_type
          ),
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      // Create new setting
      const createQuery = `
        INSERT INTO rems.system_settings (
          setting_key, setting_value, setting_type, category, description,
          is_public, requires_restart, validation_rule, default_value, updated_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      result = await query(createQuery, [
        settingKey,
        stringValue,
        setting_type,
        category,
        description,
        is_public,
        requires_restart,
        validation_rule,
        default_value,
        req.user.user_id,
      ]);

      res.status(201).json({
        success: true,
        message: 'Setting created successfully',
        data: {
          ...result.rows[0],
          parsed_value: parseSettingValue(
            result.rows[0].setting_value,
            result.rows[0].setting_type
          ),
        },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update setting',
    });
  }
};

// Delete setting
const deleteSetting = async (req, res) => {
  try {
    const settingKey = req.params.key;

    // Check if setting exists
    const existingSetting = await query(
      'SELECT setting_id FROM rems.system_settings WHERE setting_key = $1',
      [settingKey]
    );

    if (existingSetting.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found',
      });
    }

    // Delete setting
    const deleteQuery =
      'DELETE FROM rems.system_settings WHERE setting_key = $1 RETURNING *';
    const result = await query(deleteQuery, [settingKey]);

    res.json({
      success: true,
      message: 'Setting deleted successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete setting',
    });
  }
};

// Get all currencies
const getAllCurrencies = async (req, res) => {
  try {
    const activeOnly = req.query.active_only === 'true';

    let whereClause = '';
    if (activeOnly) {
      whereClause = 'WHERE is_active = true';
    }

    const currenciesQuery = `
      SELECT 
        currency_id,
        currency_code,
        currency_name,
        currency_symbol,
        exchange_rate_to_base,
        is_base_currency,
        decimal_places,
        is_active,
        last_rate_update,
        rate_source,
        created_at,
        updated_at
      FROM rems.currencies
      ${whereClause}
      ORDER BY is_base_currency DESC, currency_name ASC
    `;

    const result = await query(currenciesQuery);

    res.json({
      success: true,
      data: {
        currencies: result.rows,
        total: result.rows.length,
        base_currency: result.rows.find((c) => c.is_base_currency) || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get all currencies error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve currencies',
    });
  }
};

// Update currency
const updateCurrency = async (req, res) => {
  try {
    const currencyId = req.params.id;
    const {
      currency_name,
      currency_symbol,
      exchange_rate_to_base,
      is_base_currency,
      decimal_places,
      is_active,
      rate_source,
    } = req.body;

    // Check if currency exists
    const existingCurrency = await query(
      'SELECT * FROM rems.currencies WHERE currency_id = $1',
      [currencyId]
    );

    if (existingCurrency.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Currency not found',
      });
    }

    // If setting as base currency, unset others
    if (is_base_currency === true) {
      await query('UPDATE rems.currencies SET is_base_currency = false');
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (currency_name !== undefined) {
      updates.push(`currency_name = $${paramIndex++}`);
      values.push(currency_name);
    }
    if (currency_symbol !== undefined) {
      updates.push(`currency_symbol = $${paramIndex++}`);
      values.push(currency_symbol);
    }
    if (exchange_rate_to_base !== undefined) {
      updates.push(`exchange_rate_to_base = $${paramIndex++}`);
      values.push(exchange_rate_to_base);
    }
    if (is_base_currency !== undefined) {
      updates.push(`is_base_currency = $${paramIndex++}`);
      values.push(is_base_currency);
    }
    if (decimal_places !== undefined) {
      updates.push(`decimal_places = $${paramIndex++}`);
      values.push(decimal_places);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }
    if (rate_source !== undefined) {
      updates.push(`rate_source = $${paramIndex++}`);
      values.push(rate_source);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
    }

    updates.push(`last_rate_update = CURRENT_TIMESTAMP`);
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(currencyId);

    const updateQuery = `
      UPDATE rems.currencies 
      SET ${updates.join(', ')}
      WHERE currency_id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(updateQuery, values);

    res.json({
      success: true,
      message: 'Currency updated successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Update currency error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update currency',
    });
  }
};

// Helper functions
const parseSettingValue = (value, type) => {
  if (value === null || value === undefined) return null;

  try {
    switch (type) {
      case 'integer':
        return parseInt(value, 10);
      case 'decimal':
        return parseFloat(value);
      case 'boolean':
        return value === 'true' || value === true;
      case 'json':
      case 'array':
        return JSON.parse(value);
      case 'string':
      default:
        return value;
    }
  } catch (error) {
    console.error('Parse setting value error:', error);
    return value; // Return original value if parsing fails
  }
};

const validateSettingValue = (value, type) => {
  try {
    switch (type) {
      case 'integer':
        if (isNaN(parseInt(value, 10))) {
          return { valid: false, error: 'Value must be an integer' };
        }
        break;
      case 'decimal':
        if (isNaN(parseFloat(value))) {
          return { valid: false, error: 'Value must be a decimal number' };
        }
        break;
      case 'boolean':
        if (
          typeof value !== 'boolean' &&
          value !== 'true' &&
          value !== 'false'
        ) {
          return { valid: false, error: 'Value must be a boolean' };
        }
        break;
      case 'json':
      case 'array':
        if (typeof value === 'string') {
          JSON.parse(value); // Will throw if invalid
        } else if (typeof value !== 'object') {
          return { valid: false, error: 'Value must be valid JSON' };
        }
        break;
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

const convertToStringValue = (value, type) => {
  switch (type) {
    case 'json':
    case 'array':
      return typeof value === 'string' ? value : JSON.stringify(value);
    case 'boolean':
      return String(Boolean(value));
    default:
      return String(value);
  }
};

module.exports = {
  getAllSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
  getAllCurrencies,
  updateCurrency,
};
