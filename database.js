const dotenv = require('dotenv').config();
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const userModel = require('./models/user');
const materialModel = require('./models/material');
const houseModel = require('./models/house');
const housePhaseModel = require('./models/housePhase');
const materialInventoryModel = require('./models/materialInventory');
const phaseModel = require('./models/phase');
const phaseMaterialModel = require('./models/phaseMaterial');
const projectModel = require('./models/project');
const purchaseOrderModel = require('./models/purchaseOrder');
const requisitionFormModel = require('./models/requisitionForm');
const templateModel = require('./models/template');
const templateMaterialModel = require('./models/templateMaterial');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const sequelize = new Sequelize(process.env.DB_URL, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

const User = userModel(sequelize, Sequelize);
const Inventory = materialInventoryModel(sequelize, Sequelize);
const Phase = phaseModel(sequelize, Sequelize);
const House = houseModel(sequelize, Sequelize);
const HousePhase = housePhaseModel(sequelize, Sequelize);
const PhaseMaterial = phaseMaterialModel(sequelize, Sequelize);
const Project = projectModel(sequelize, Sequelize);
const PurchaseOrder = purchaseOrderModel(sequelize, Sequelize);
const RequisitionForm = requisitionFormModel(sequelize, Sequelize);
const Template = templateModel(sequelize, Sequelize);
const TemplateMaterial = templateMaterialModel(sequelize, Sequelize);
const Material = materialModel(sequelize, Sequelize);

User.hasMany(RequisitionForm, { onDelete: 'CASCADE' });
User.hasMany(PurchaseOrder, { onDelete: 'CASCADE' });
House.hasMany(HousePhase, { onDelete: 'CASCADE' });
Phase.hasMany(House, { onDelete: 'CASCADE' });
Project.hasMany(Phase, { onDelete: 'CASCADE' });
Project.belongsTo(User, { onDelete: 'CASCADE', foreignKey: 'engineerInCharge', as:'EIC'});
Project.belongsTo(User, { onDelete: 'CASCADE', foreignKey: 'engineerHead', as:'EHEAD' });
Project.hasMany(House, { onDelete: 'CASCADE' });
Template.hasMany(House, { onDelete: 'CASCADE' })
TemplateMaterial.hasMany(Template, {onDelete:'CASCADE'});
Material.hasMany(TemplateMaterial, {onDelete: 'CASCADE'});
Material.hasMany(Inventory, {onDelete: 'CASCADE'});
Inventory.hasMany(PhaseMaterial, {onDelete: 'CASCADE'});

sequelize.sync({alter: true, force: true}).then(()=>{
    User.findCreateFind({where:{
        username: 'master',
        password: encryptPassword('a'),
        email: 'brennanmato@gmail.com',
        userType: 0,
        fullName: 'Brennan Matriano' 
    }});
    User.findCreateFind({where:{
        username: 'master2',
        password: encryptPassword('a'),
        email: 'a@gmail.com',
        userType: 3,
        fullName: 'A Matriano' 
    }});
    User.findCreateFind({where:{
        username: 'ware',
        password: encryptPassword('a'),
        email: 'd@gmail.com',
        userType: 2,
        fullName: 'A Matriano' 
    }});
    PurchaseOrder.findCreateFind({where:{
        description:"Need more cement to complete this project",
        comments:"",
        materials:1,
        orderedBy: 'B Matriano',
        dateOrdered:'12/12/1999'
    }});
    User.findCreateFind({where:{
        username: 'master3',
        password: encryptPassword('a'),
        email: 'b@gmail.com',
        userType: 3,
        fullName: 'B Matriano' 
    }}).then(()=>{
        User.findCreateFind({where:{
            username: 'master4',
            password: encryptPassword('a'),
            email: 'c@gmail.com',
            userType: 1,
            fullName: 'B Matriano' 
        }}).then(()=>{
            Project.findCreateFind({where:{
                projectName: 'Super Project',
                  projectLocation: 'Pasig',
                  startDate: '12/12/1999',
                  completionDate: '12/12/1999',
                  engineerInCharge: 3,
                  engineerHead: 2
            }});
        })
    });


    Material.findCreateFind({where:{
        materialName:'Sand'
    }});
    Material.findCreateFind({where:{
        materialName:'Steel'
    }});
    Material.findCreateFind({where:{
        materialName:'Gravel'
    }});
    Template.findCreateFind({where:{
        templateName:'Basic house',
        description:'Basic house used for testing. Do not use in production.'
    }}).then(()=>{
        TemplateMaterial.findCreateFind({where:{
            quantity: 100,
            category: 0,
            materialId: 1,
        }});
        TemplateMaterial.findCreateFind({where:{
            quantity: 100,
            category: 0,
            materialId: 2,
        }});
        TemplateMaterial.findCreateFind({where:{
            quantity: 100,
            category: 0,
            materialId: 3,
        }})
    })
})

function encryptPassword(plaintext) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(plaintext, salt);
    return (password);
}

module.exports = {
    User,
    Inventory,
    Phase,
    House,
    HousePhase,
    PhaseMaterial,
    Project,
    Material,
    PurchaseOrder,
    RequisitionForm,
    Template,
    TemplateMaterial,
    sequelize
};