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
    models.RequisitionForm.findAll().then((requisitionData) => {
        console.log(requisitionData)
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
    models.RequisitionForm.findByPk(req.params.id).then((requisitionData) => {
        res.render('warehouse/wviewrequisition', {
            active: {
                encoder: true,
                wrequisition: true
            },
            item: requisitionData,
            data: requisitionData,
            columns: viewrequisitionColumns,
            pageHeader: "Requisition Form",
            helpers: {
                json: function (a) {
                    var stringified = JSON.stringify(a);
                    return stringified.replace(/&quot;/g, '\\"');
                }
            }
        });
    });

});

router.post('/status', function (req, res) {
    console.log(req.body);
    res.redirect('/warehouse/po');
});

router.post('/received_quantity', function (req, res) {
    console.log(req.body);
    res.redirect('/warehouse/po');
});

router.post('/update_inventory', function (req, res) {
    models.Inventory.update(req.body.deltas, { where: { id: req.body.id } }).then(() => {
        res.redirect('/warehouse/inventory');
    })
});


module.exports = router;