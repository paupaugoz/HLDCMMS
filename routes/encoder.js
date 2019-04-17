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

// Pending  /requisition, /requsisition/new, /requsisition/new2

router.get('/dashboard', (req, res) => {
    res.render('encoder/edashboard', {
        active: {
            encoder: true
        },
        pageHeader: "Welcome!"
    });
});


router.get('/po', (req, res) => {
    models.PurchaseOrder.findAll().then((poData) => {
        models.Material.findAll().then((material)=>{
            console.log(material)
            res.render('encoder/epo', {
                active: {
                    encoder: true,
                    epo: true
                },
                data: poData,
                columns: poColumns,
                materials: material,
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
});

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
    models.RequisitionForm.findByPk(req.params.id).then((requisitionData) => {
        res.render('encoder/eviewrequisition', {
            active: {
                encoder: true,
                erequisition: true
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

router.get('/requisition/new', (req, res) => {
    res.render('encoder/ecreatereq', {
        active: {
            encoder: true,
            erequisition: true
        },
        pageHeader: "Requisition Form",
        helpers: {
      json: function (a) {
        var stringified = JSON.stringify(a);
        return stringified.replace(/&quot;/g, '\\"');
      }
  }
    });
});

router.get('/requisition/new/2', (req, res) => {
    console.log(req.params.id);
    var itemId = req.params.id;
    var item = poData.find((a) => {
        return a.id == itemId
    });
    console.log(item);
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
router.post('/deleteERequisition', function (req, res) {
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

router.post('/posteReq1', function (req, res) {
    models.RequisitionForm.create(req.body).then(() => {
        res.redirect('/encoder/requisition2');
    });
});

router.post('/posteReq2', function (req, res) {
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