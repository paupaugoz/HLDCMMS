const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const models = require('../database');
const {
    poColumns,
    requisitionColumns,
    viewrequisitionColumns,
    editrequisitionColumns
} = require('../config/vars');
const exphbs = require('express-handlebars');
const Sequelize = require('sequelize');

router.get('/dashboard', (req, res) => {
    res.render('encoder/edashboard', {
        active: {
            encoder: true,
            dashboard: true
        },
        pageHeader: "Welcome!"
    });
});


router.get('/po', (req, res) => {
    models.PurchaseOrder.findAll().then((poData) => {
        models.Material.findAll().then((material)=>{
            models.Project.findAll().then((projects)=>{
                res.render('encoder/epo', {
                    active: {
                        encoder: true,
                        epo: true
                    },
                    data: poData,
                    columns: poColumns,
                    materials: material,
                    projects: projects,     
                    pageHeader: "Create a New Purchase Order",
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

router.get('/po/new',(req,res)=>{
    models.Material.findAll().then((material)=>{
        models.Project.findAll().then((projects)=>{
            res.render('encoder/ecreatepo2',{
                active: {
                    encoder: true,
                    eponew: true
                },
                pageHeader: "Create a New Purchase Order",
                projects: projects,
                materials:material
            })  
        })
    })
})

router.post('/po/new',(req,res)=>{
    console.log(req)
    let user_id = req.user.dataValues.fullName
    req.body.orderedBy = user_id;
    req.body.materials = JSON.stringify(req.body.materials) 
    models.PurchaseOrder.create(req.body).then((po)=>{
        console.log(po)
    })
})

router.get('/materials', (req, res) => {
    res.render('encoder/ematerials', {
        active: {
            encoder: true,
            ematerials: true
        },
        pageHeader: "Create Material",
    });
});

router.get('/requisition', (req, res) => {
    models.RequisitionForm.findAll().then((requisitionData) => {
        res.render('encoder/erequisition', {
            active: {
                encoder: true,
                erequisition: true
            },
            data: requisitionData,
            columns: editrequisitionColumns,
            pageHeader: "Create a New Requisition Form",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    })
});

router.get('/requisition/:id', (req, res) => {
    models.RequisitionForm.findByPk(req.params.id, { raw: true }).then((requisitionData) => {

        let requisition_materials = JSON.parse(requisitionData.materials);
        let promises = []
        let materials_set = new Set([])
        let materials_latest = []
        let rows = []
        let unfulfillable=false

        for (let material of requisition_materials) {
            materials_set.add(material.material)
        }

        for (let material of materials_set) {
            promises.push(
                models.Material.findAll({
                    where: { materialName: material },
                    include: [models.Inventory],
                    raw: true
                }).then((materials) => {
                    materials_latest.push({
                        name: material,
                        history: materials
                    });

                })
            )
        }

        Promise.all(promises).then(() => {
            for (let req_mat of requisition_materials) {
                let history = materials_latest.find((material) => {
                    return material.name == req_mat.material
                }).history
                let required = parseFloat(req_mat.quantity)
                let expensed = 0
                let to_compute = []
                for (let i = 0; i < history.length; i++) {
                    let available = history[i]['materialInventories.quantityBought'] - history[i]['materialInventories.quantityUsed']
                    if (available + expensed >= required) {
                        history[i]['materialInventories.quantityUsed'] += (required - expensed)
                        expensed = required
                    }
                    else {
                        expensed += available
                        history[i]['materialInventories.quantityUsed'] = history[i]['materialInventories.quantityBought']
                    }
                    to_compute.push(
                        {
                            quantity: available,
                            price: history[i]['materialInventories.price'],
                        }
                    )
                    if(expensed==required){
                        break
                    }
                }
                console.log(history)
                let total_quantity = 0
                let total_cost = 0
                for (let entry of to_compute) {
                    total_cost += entry.price * entry.quantity
                    total_quantity += entry.quantity
                }
                if(expensed==required){
                    rows.push(
                        {
                            unit: total_cost / total_quantity,
                            description: req_mat.material,
                            quantity: req_mat.quantity
                        }
                    )
                }else{
                    unfulfillable=true
                    rows.push(
                        {
                            unit: "Not enough materials!",
                            description: req_mat.material,
                            quantity: req_mat.quantity
                        }
                    )
                }
                console.log(rows)
            }
            res.render('encoder/eviewrequisition', {
                active: {
                    encoder: true,
                    erequisition: true
                },
                item: requisitionData,
                data: rows,
                dateCreated: requisitionData.dateCreated,
                columns: viewrequisitionColumns,
                unfulfillable:unfulfillable,
                pageHeader: "Requisition Form",
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

router.get('/create/requisition', (req, res) => {
    models.Project.findAll().then((projects)=>{
        models.Material.findAll().then((materials)=>{
            res.render('encoder/ecreatereq3', {
                active: {
                    encoder: true,
                    erequisition: true
                },
                projects:projects,
                materials:materials,
                pageHeader: "Requisition Form",
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

router.get('/requisition/new/2', (req, res) => {
    var itemId = req.params.id;
    var item = poData.find((a) => {
        return a.id == itemId
    });
    res.render('encoder/ecreatereq2', {
        active: {
            encoder: true,
            erequisition: true
        },
        item: requisitionData.find((a) => {
            return a.id == itemId
        }),
        data: requisitionData,
        columns: viewrequisitionColumns,
        pageHeader: "Create a New Requisition Form",
        helpers: {
            json: function (a) {
                var stringified = JSON.stringify(a);
                return stringified.replace(/&quot;/g, '\\"');
            }
        }
    });
});
//edit Requisition
router.post('/postEditRequisition', function (req, res) {
    console.log(req.body);
    res.redirect('/encoder/eviewrequisition');
});

//delete Requisition
router.get('/deleteERequisition/:id', function (req, res) {
    models.RequisitionForm.destroy({where:{id:req.params.id}}).then(()=>{
        res.redirect('/encoder/requisition');
    })

    console.log(req.body);
});




router.post('/postPurchaseOrderTable', function (req, res) {
    console.log(req.user.dataValues.username)
    req.body.orderedBy = req.user.dataValues.username
    models.PurchaseOrder.create(req.body).then(() => {
        res.redirect('/encoder/po');
    })
});

router.post('/posteMaterialForm', function (req, res) {
    console.log(req.body);
    let promises = [];
    for (let key in req.body) {
        promises.push(models.Material.create({ materialName: req.body[key] }))
    }
    Promise.all(promises).then(() => {
        res.redirect('/encoder/materials');
    })
});

router.get('/deleteEpo/:id', function (req, res) {
    models.PurchaseOrder.destroy({where:{id:req.params.id}}).then(()=>{
        res.redirect('/encoder/po')
    })
    console.log(req.body);
});

router.post('/posteReq1', function (req, res) {
    req.body.status = 'pending';
    models.RequisitionForm.create(req.body).then(() => {
        res.redirect('/encoder/requisition2');
    });
});

router.post('/req/new', function (req, res) {
    req.body.materials = JSON.stringify(req.body.materials)
    req.body.UserId = req.user.dataValues.id
    models.RequisitionForm.create(req.body).then(() => {
        res.redirect('/encoder/requisition');
    });
});

//new add PO
router.post('/postNewPO', function (req, res) {
    console.log(req.body);
    console.log(req)
    res.redirect('/encoder/po');
});

module.exports = router