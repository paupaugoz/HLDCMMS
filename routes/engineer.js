const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const models = require('../database');
const {
    projectsColumns,
    poColumns,
    poviewColumns,
    viewprojectsColumns,
    requisitionColumns,
    bomColumns,
    purchaseReportColumn,
    createtemplatesColumns
} = require('../config/vars');
const Sequelize = require('sequelize');


router.get('/dashboard', (req, res) => {
    res.render('engineer/engdashboard', {
        active: {
            engineer: true,
            dashboard: true
        },
        pageHeader: "Welcome!"
    });
});


router.get('/bom/new/:id', (req, res) => {
    console.log(req.params.id);
    var itemId = req.params.id;
    var item = poData.find((a) => {
        return a.id == itemId
    });
    console.log(item);
    res.render('engineer/engcreatebom', {
        active: {
            management: true,
            projects: true
        },
        item: projectsData.find((a) => {
            return a.id == itemId
        }),
        data: purchaseReportData,
        columns: purchaseReportColumn,
        pageHeader: "BOM",
        helpers: {
            json: function (a) {
                var stringified = JSON.stringify(a);
                return stringified.replace(/&quot;/g, '\\"');
            }
        }
    });
});


router.get('/po', (req, res) => {
    models.PurchaseOrder.findAll().then((poData)=>{
        res.render('engineer/engpo', {
            active: {
                engineer: true,
                engpo: true
            },
            data: poData,
            columns: poColumns,
            pageHeader: "Purchase Orders",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    })
});

router.get('/po/:id', (req, res) => {
    models.PurchaseOrder.findByPk(req.params.id).then((poviewData)=>{
        res.render('engineer/engviewpo', {
            active: {
                engineer: true,
                engpo: true
            },
            item: poviewData,
            data: poviewData,
            columns: poviewColumns,
            pageHeader: "Purchase Orders",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });        
    })
});


router.get('/projects', (req, res) => {
    models.Project.findAll({
        raw: true,
        attributes: {
            include: [Sequelize.col('EIC.fullName')]
        },
        include:[
        {
            model: models.User,
            attributes:['fullName'],
            on: {
                id: Sequelize.where(Sequelize.col("project.engineerInCharge"), "=", Sequelize.col("EIC.id")),
            },
            as: 'EIC'
        },
    ]}).then((projectsData)=>{
        models.Template.findAll().then((templatesData)=>{
            console.log(projectsData)
            res.render('engineer/engprojects', {
                active: {
                    engineer: true,
                    engprojects: true
                },
                data: projectsData,
                columns: projectsColumns,
                templates: templatesData,
                pageHeader: "Project",
                helpers: {
                    json: function (a) {
                        var stringified = JSON.stringify(a);
                        return stringified.replace(/&quot;/g, '\\"');
                    }
                }
            });
        })
    })
});

router.get('/requisition', (req, res) => {
    models.RequisitionForm.findAll().then((requisitionData)=>{
        res.render('engineer/engrequisition', {
            active: {
                engineer: true,
                engrequisition: true
            },
            data: requisitionData,
            columns: requisitionColumns,
            pageHeader: "Requisition Forms",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    });
});


router.get('/projects/:id', (req, res) => {
    models.Project.findAll({
        where:{id:req.params.id},
        raw: true,
        attributes: {
            include: [[Sequelize.col('EIC.fullName'),'EIC'],[Sequelize.col('EHEAD.fullName'),'EHEAD']]
        },
        include:[
        {
            model: models.User,
            attributes:['fullName'],
            on: {
                id: Sequelize.where(Sequelize.col("project.engineerInCharge"), "=", Sequelize.col("EIC.id")),
            },
            as: 'EIC'
        },
        {
            model: models.User,
            attributes:['fullName'],
            on: {
                id: Sequelize.where(Sequelize.col("project.engineerHead"), "=", Sequelize.col("EHEAD.id")),
            },
            as: 'EHEAD'
        },
    ]}).then((viewprojectsData)=>{
        res.render('engineer/engviewprojects', {
            active: {
                engineer: true,
                engprojects: true
            },
            item: viewprojectsData[0],
            data: viewprojectsData[0],
            columns: viewprojectsColumns,
            pageHeader: "Project",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    })
});

router.post('/deletePo', function(req, res) {
    console.log(req.body);
  });

module.exports = router;