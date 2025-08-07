const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: 'admin'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'admins',
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        admin.password = await bcrypt.hash(admin.password, 12);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, 12);
      }
    }
  }
});

// Instance method to check password
Admin.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Class method to create default admin
Admin.createDefaultAdmin = async function() {
  try {
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });
    
    if (!adminExists) {
      const admin = await Admin.create({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD || 'SalahDev',
        email: process.env.ADMIN_EMAIL || 'dev@boussettahsalah.online'
      });
      console.log('✅ Default admin created successfully');
      console.log(`📧 Admin email: ${admin.email}`);
      console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'SalahDev'}`);
    } else {
      // Update email if it's different
      const expectedEmail = process.env.ADMIN_EMAIL || 'dev@boussettahsalah.online';
      if (adminExists.email !== expectedEmail) {
        await adminExists.update({ email: expectedEmail });
        console.log(`✅ Admin email updated to: ${expectedEmail}`);
      }
      console.log('✅ Admin account already exists');
      console.log(`📧 Admin email: ${adminExists.email}`);
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

module.exports = Admin;