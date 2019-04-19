const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const models = require('../database');
const {
    inventoryColumns,
    poColumns,
    poviewColumns,
    popendingColumns,
    requisitionColumns,
    viewrequisitionColumns,
} = require('../config/vars');
const Sequelize = require('sequelize');
const exphbs = require('express-handlebars');


router.get('/dashboard', (req, res) => {
    res.render('warehouse/wdashboard', {
        active: {
            warehouse: true,
            dashboard: true
        },
        pageHeader: "Welcome!",
        helpers: {
            json: function (a) {
                var stringified = JSON.stringify(a);
                return stringified.replace(/&quot;/g, '\\"');
            }
        }
    });
});


router.get('/inventory', (req, res) => {
    models.Inventory.findAll().then((inventoryData) => {
        res.render('warehouse/winventory', {
            active: {
                warehouse: true,
                winventory: true
            },
            data: inventoryData,
            columns: inventoryColumns,
            pageHeader: "Inventory",
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
    models.PurchaseOrder.findAll().then((poData) => {
        res.render('warehouse/wpo', {
            active: {
                warehouse: true,
                wpo: true
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
    models.PurchaseOrder.findByPk(req.params.id).then(() => {
        res.render('warehouse/wviewpo', {
            active: {
                warehouse: true,
                wpo: true
            },
            item: poviewData,
            data: poviewData,
            columns: poviewColumns,
            pageHeader: "Purchase Order",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    });
});

router.get('/po/pending/:id', (req, res) => {
    models.PurchaseOrder.findByPk(req.params.id).then((poData) => {
        res.render('warehouse/wpendingpo', {
            active: {
                warehouse: true,
                wpo: true
            },
            item: poData,
            data: popendingData,
            columns: popendingColumns,
            pageHeader: "Purchase Order",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    })
});

router.get('/requisition', (req, res) => {
    models.RequisitionForm.findAll({where:{status:'pending'}}).then((requisitionData) => {
        res.render('warehouse/wrequisition', {
            active: {
                warehouse: true,
                wrequisition: true
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
            res.render('warehouse/wviewrequisition', {
                active: {
                    encoder: true,
                    wrequisition: true
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


router.get('/requisition/approve/:id', (req, res) => {
    models.RequisitionForm.findByPk(req.params.id, { raw: true }).then((requisitionData) => {
        models.RequisitionForm.update({status: 'approved'},{where:{id:req.params.id}});
        let requisition_materials = JSON.parse(requisitionData.materials);
        let promises = []
        let materials_set = new Set([])
        let materials_latest = []
        let rows = []

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
            let i = 0;
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
                    models.Inventory.update({
                        quantityUsed: history[i]['materialInventories.quantityUsed']
                    },{
                        where:{
                            id:history[i]['materialInventories.id']
                        }
                    });
                }
                let total_quantity = 0
                let total_cost = 0
                for (let entry of to_compute) {
                    total_cost += entry.price * entry.quantity
                    total_quantity += entry.quantity
                }
                requisition_materials[i].average_price = total_cost/total_quantity
                i++;
            }
            models.RequisitionForm.update({materials: JSON.stringify(requisition_materials)},{where:{id:req.params.id}});
            res.redirect('/warehouse/requisition');
        })
    });
})

router.get('/requisition/deny/:id', (req, res) => {
    models.RequisitionForm.update({status: 'denied'},{where:{id:req.params.id}})
    res.redirect('/warehouse/requisition');
})


router.post('/status', function (req, res) {
    res.redirect('/warehouse/po');
});

router.post('/received_quantity', function (req, res) {
    res.redirect('/warehouse/po');
});

router.post('/update_inventory', function (req, res) {
    models.Inventory.update(req.body.deltas, { where: { id: req.body.id } }).then(() => {
        res.redirect('/warehouse/inventory');
    })
});


module.exports = router;