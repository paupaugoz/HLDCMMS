const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const models = require('../database');
const {
    projectsColumns,
    employeeColumns,
    templatesColumns,
    materialColumns,
    poColumns,
    poviewColumns,
    viewprojectsColumns,
    bomColumns,
    purchaseReportColumn,
    createtemplatesColumns,
} = require('../config/vars');
const Sequelize = require('sequelize');
const exphbs = require('express-handlebars');
const bcrypt = require("bcrypt-nodejs");
const Op = Sequelize.Op;


router.get('/dashboard', (req, res) => {
    models.User.findAll().then((users) => {
        res.render('management/mdashboard', {
            active: {
                management: true,
                dashboard: true,
            },
            data: users,
            columns: employeeColumns,
            pageHeader: "Welcome!",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    })
});


router.get('/project_reports', (req, res) => {
    models.User.findAll().then((users) => {
        models.Project.findAll().then((projects)=>{
            res.render('management/projectReports', {
                active: {
                    management: true,
                    reports: true
                },
                data: users,
                columns: employeeColumns,
                pageHeader: "Reports",
                projects: projects,
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

router.get('/purchase_orders', (req, res) => {
    models.User.findAll().then((users) => {
        models.Project.findAll().then((projects)=>{
            res.render('management/purchaseReports', {
                active: {
                    management: true,
                    reports: true
                },
                data: users,
                columns: employeeColumns,
                projects: projects,
                pageHeader: "Reports",
                helpers: {
                    json: function (a) {
                        var stringified = JSON.stringify(a);
                        return stringified.replace(/&quot;/g, '\\"');
                    }
                }
            });
        })
    });
});

router.get('/purchase_report/new', (req, res) => {
    res.render('/management/generatePurchaseReport', {
        active: {
            management: true,
            reports: true
        },
        data: purchaseReportData,
        columns: purchaseReportColumn,
        pageHeader: "Reports",
        helpers: {
            json: function (a) {
                var stringified = JSON.stringify(a);
                return stringified.replace(/&quot;/g, '\\"');
            }
        }
    });
});

router.get('/project_report/new', (req, res) => {
    res.render('management/generateProjectReport', {
        active: {
            management: true,
            reports: true
        },
        data: bomData,
        columns: bomColumns,
        pageHeader: "Reports",
        helpers: {
            json: function (a) {
                var stringified = JSON.stringify(a);
                return stringified.replace(/&quot;/g, '\\"');
            }
        }
    });
});

router.get('/employees', (req, res) => {
    models.User.findAll({raw:true}).then((employeeData) => {
        for(let i in employeeData){
            employeeData[i].userType == 0? employeeData[i].userType = "Management" : true;
            employeeData[i].userType == 1? employeeData[i].userType = "Encoder" : true;
            employeeData[i].userType == 2? employeeData[i].userType = "Warehouse" : true;
            employeeData[i].userType == 3? employeeData[i].userType = "Engineer" : true;
        }
        res.render('management/employees', {
            active: {
                management: true,
                employees: true
            },
            data: employeeData,
            columns: employeeColumns,
            pageHeader: "Employees",
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
        include: [
            {
                model: models.User,
                attributes: ['fullName'],
                on: {
                    id: Sequelize.where(Sequelize.col("project.engineerInCharge"), "=", Sequelize.col("EIC.id")),
                },
                as: 'EIC'
            },
        ]
    }).then((projectsData) => {
        models.Template.findAll().then((templatesData) => {
            models.Material.findAll().then((materialsData)=>{
                res.render('management/projects', {
                    active: {
                        management: true,
                        projects: true
                    },
                    data: projectsData,
                    columns: projectsColumns,
                    templates: templatesData,
                    materials:materialsData,
                    pageHeader: "Projects",
                    helpers: {
                        json: function (a) {
                            var stringified = JSON.stringify(a);
                            return stringified.replace(/&quot;/g, '\\"');
                        }
                    }
                });
            })
        })
    })
});

router.get('/projects/new', (req, res) => {
    models.User.findAll({ where: { userType: 3 } }).then((engineers) => {
        res.render('management/createprojects', {
            active: {
                management: true,
                projects: true
            },
            pageHeader: "Create a New Project",
            engineerList: engineers
        });
    })
});

router.get('/viewprojects/:id', (req, res) => {
    models.Project.findAll({
        where: { id: req.params.id },
        raw: true,
        attributes: {
            include: [[Sequelize.col('EIC.fullName'), 'EIC'], [Sequelize.col('EHEAD.fullName'), 'EHEAD']]
        },
        include: [
            {
                model: models.User,
                attributes: ['fullName'],
                on: {
                    id: Sequelize.where(Sequelize.col("project.engineerInCharge"), "=", Sequelize.col("EIC.id")),
                },
                as: 'EIC'
            },
            {
                model: models.User,
                attributes: ['fullName'],
                on: {
                    id: Sequelize.where(Sequelize.col("project.engineerHead"), "=", Sequelize.col("EHEAD.id")),
                },
                as: 'EHEAD'
            },
        ]
    }).then((viewprojectsData) => {
        models.Template.findAll().then((templatesData)=>{
            models.House.findAll({where:{projectId:req.params.id}}).then((houses)=>{
                res.render('management/viewprojects', {
                    active: {
                        management: true,
                        viewprojects: true
                    },
                    item: viewprojectsData[0],
                    data: houses,
                    columns: viewprojectsColumns,
                    templates: templatesData,
                    projectId:req.params.id,
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
    })
});


router.get('/po/report', (req, res) => {
    console.log(req.query);
    req.query.startDate == "" ? req.query.startDate = "1970-01-01 00:00:01" : true;
    req.query.endDate == "" ? req.query.endDate = "9999-12-31 23:59:59" : true;
    let _where = {projectId: parseInt(req.query.projectId),
    createdAt:{
        [Op.between]:[req.query.startDate,req.query.endDate]
    }};
    models.PurchaseOrder.findAll({where:_where, raw: true, logging: console.log}).then((purchases)=>{
        let dict = {}
        for(let purchase of purchases){
            console.log(purchase)
            materials = JSON.parse(purchase.materials)
            for(let material of materials){
                if(material.material in dict){
                    dict[material.material] = {
                        unit_price:  (dict[material.material].unit_price * dict[material.material].quantity + parseFloat(material.unit_price) * parseFloat(material.quantity))/(parseFloat(material.quantity)+dict[material.material].quantity), 
                        total_price: dict[material.material].total_price + parseFloat(material.total_price), 
                        quantity: dict[material.material].quantity + parseFloat(material.quantity),
                    }
                }
                else{
                    dict[material.material] = {
                        unit_price: parseFloat(material.unit_price), 
                        total_price: parseFloat(material.total_price), 
                        quantity: parseFloat(material.quantity),
                    }
                }
            }
        }
        report_data = []
        for(let key in dict){
            let data = dict[key]
            data.material = key
            report_data.push(data)
        }
        console.log(report_data)
        res.render('management/generatePurchaseReport', {
            active: {
                management: true,
                reports: true
            },
            data: report_data,
            columns: purchaseReportColumn,
            pageHeader: "Reports",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    });
})


router.get('/createbom/:id', (req, res) => {
    models.Project.findByPk(req.params.id).then((projectsData) => {
        res.render('management/createbom', {
            active: {
                management: true,
                createbom: true
            },
            item: projectsData,
            data: projectsData,
            columns: purchaseReportColumn,
            pageHeader: "BOM",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    })
});

router.get('/po', (req, res) => {
    models.PurchaseOrder.findAll({where:{status:'Pending'}}).then((poData) => {
        let approved = 0;
        let pending = 0;
        for (let data in poData) {
            if (data.status == "Pending") {
                pending++;
            }
            else {
                approved++;
            }
        }
        res.render('management/po', {
            active: {
                management: true,
                viewAPO: true,
                highlight: true
            },
            data: poData,
            columns: poColumns,
            pendingCount: pending,
            approvedCount: approved,
            pageHeader: "Purchase Orders",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    });
});

// Direct to view page based on item id if routerroved
router.get('/po/:id', (req, res) => {
    models.PurchaseOrder.findByPk(req.params.id).then((poData)=>{
        console.log(JSON.parse(poData.materials))
        res.render('management/viewapo', {
            active: {
                management: true,
                viewAPO: true,
                highlight: true
            },
            item: poData,
            data: JSON.parse(poData.materials),
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


//Direct to view page based on item id if pending
router.get('/po/:id/pending', (req, res) => {
    console.log(req.params.id);
    var itemId = req.params.id;
    var item = poData.find((a) => {
        return a.id == itemId
    });
    console.log(item);
    res.render('management/pendingpo', {
        active: {
            management: true,
            pendingPO: true,
            highlight: true
        },
        item: poData.find((a) => {
            return a.id == itemId
        }),
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
});

/* Direct to view page based on item id if pending
router.get('/viewapo/:id', (req, res) => {
  console.log(req.params.id);
  var itemId = req.params.id;
  var item = poData.find((a) => {return a.id == itemId});
  console.log(item);
  res.render('management/viewapo', { active: {PO: true}, item: poData.find((a) => {return a.id == itemId}), data: poviewData, columns: poviewColumns, pageHeader: "Purchase Orders"});
});
*/


router.get('/templates', (req, res) => {
    models.Template.findAll().then((templatesData) => {
        res.render('management/templates', {
            active: {
                management: true,
                templates: true
            },
            data: templatesData,
            columns: templatesColumns,
            pageHeader: "Templates",
            helpers: {
                json: function (a) {
                  var stringified = JSON.stringify(a);
                  return stringified.replace(/&quot;/g, '\\"');
                }
            } 
        });
    })
});

router.get('/templates/new', (req, res) => {
    models.Template.findAll().then((templatesData) => {
        models.Material.findAll({raw:true}).then((materialsData)=>{
            res.render('management/createtemplate2', {
                active: {
                    management: true,
                    templates: true,
                    createtemplate: true
                },
                data: templatesData,
                columns: createtemplatesColumns,
                materials:materialsData,
                materials_string:JSON.stringify(materialsData).replace(/&quot;/g, '\\"'),
                pageHeader: "Templates",
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

router.get('/materials', (req, res) => {
    models.Material.findAll().then((materialData) => {
        res.render('management/materials', {
            active: {
                management: true,
                materials: true
            },
            data: materialData,
            columns: materialColumns,
            pageHeader: "Materials",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    })
});

router.get('/materials/new', (req, res) => {
    res.render('management/creatematerials', {
        active: {
            management: true,
            materials: true
        }
    });
});

router.get('/po/approve/:id', (req, res) => {
    models.PurchaseOrder.findByPk(req.params.id).then((purchase_order)=>{
        let materials = JSON.parse(purchase_order.materials)
        for(let material of materials){
            models.Material.findOne({where:{materialName: material.material}}).then((_material)=>{
                if(_material.priceHistory!=null){
                    console.log(_material.priceHistory)
                    history=JSON.parse(_material.priceHistory);
                    
                    history.push(material.unit_price)
                    _material.update({priceHistory:JSON.stringify(history)})
                }else{
                    _material.update({priceHistory:JSON.stringify([material.unit_price])})
                }
            })
        }
    })

    models.PurchaseOrder.update({status: 'Approved'},{where:{id:req.params.id}}).then(()=>{
        res.redirect('/management/po');
    });
});

router.get('/po/deny/:id', (req, res) => {
    models.PurchaseOrder.update({status: 'Denied'},{where:{id:req.params.id}}).then(()=>{
        res.redirect('/management/po');
    });
});

router.get('/po/delete/:id', (req, res) => {
    models.PurchaseOrder.destroy({where:{id:req.params.id}}).then(()=>{
        res.redirect('/management/po');
    });
});

router.post('/postMaterialForm', function (req, res) {
    models.Material.create(req.body).then(() => {
        res.redirect('/management/materials');
    })
});

router.get('/house/delete/:id', (req,res)=>{
    models.House.destroy({where:{id:req.params.id}});
    res.redirect('/management/projects')
})

// Create project form
router.post('/projects/new', function (req, res) {
    models.Project.create(req.body).then(() => {
        res.redirect('/management/projects');
    });
});

//Employee modal form
router.post('/employee/new', function (req, res) {
    req.body.password = encryptPassword(req.body.password)
    models.User.create(req.body).then(() => {
        res.redirect('/management/employees');
    });
});

//Pending PO decline
router.post('/po/decline', function (req, res) {
    console.log(req.body);
    res.redirect('/management/po');
});

//Management pushback comments form
router.post('/postPushBackComment', function (req, res) {
    console.log(req.body);
    res.redirect('/management/po');
});

router.post('/postCreateTemplateForm', function (req, res) {
    console.log(req.body);
    res.redirect('/management/templates/new');
});

router.post('/postViewProjectsForm', function (req, res) {
    models.Template.findByPk(req.body.templateId).then((template)=>{
        req.body.template=template.templateName
        models.House.create(req.body).then(()=>{
            res.redirect('/management/projects');
        })
    })
});

function encryptPassword(plaintext) {
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(plaintext, salt);
    return (password);
}

//Edit PO
router.post('/po/edit', function (req, res) {
    console.log(req.body);
    res.redirect('/management/po');
});

//Edit employee
router.post('/editEmployee', function (req, res) {
    console.log(req.body);
    res.redirect('./employees');
});

//Edit template
router.post('/editTemplate', function (req, res) {
    console.log(req.body);
    res.redirect('./createtemplate');
});

//Edit project
router.post('/postEditProject', function (req, res) {
    console.log(req.body);
    res.redirect('/management/projects');
});

//Delete management


router.post('/deleteEmployees', function (req, res) {
    models.User.destroy({where:{id:JSON.parse(req.body.item).id}})
    console.log(req.body);
});

router.post('/deleteProjects', function (req, res) {
    models.Project.destroy({where:{id:JSON.parse(req.body.item).id}})
});

router.post('/deleteviewAPO', function (req, res) {
    console.log(req.body);
});

router.post('/deleteviewProjects', function (req, res) {
    console.log(req.body);
});

router.post('/deletecreateBom', function (req, res) {
    console.log(req.body);
});

router.post('/templates/new', function (req, res) {
    models.Template.create({templateName:req.body.templateName,description:req.body.templateDescription}).then((template)=>{
        let template_id = template.dataValues.id;
        for(let material of req.body.materials){
            let material_name = material.material
            models.Material.findAll({where:{materialName:material_name},raw:true}).then((_material)=>{
                console.log(_material)
                models.TemplateMaterial.create({
                    quantity: material.quantity,
                    category: material.category,
                    templateId: template_id,
                    materialId: _material[0].id,
                })
            })
        }
        console.log(template)
    })
    console.log(req.body);
});

router.post('/deleteCreateTemplate', function (req, res) {
    console.log(req.body);
});

router.post('/deleteMaterial', function (req, res) {
    models.Material.destroy({where:{
        id:JSON.parse(req.body.item).id}
    })
    console.log(req.body);
});

//Edit materials
router.post('/editMaterial', function (req, res) {
    console.log(req.body);
    res.redirect('./materials');
});

router.post('/deleteviewAPO', function (req, res) {
    console.log(req.body);
});

module.exports = router