let projectsColumns = [{
    "name": "id",
    "value": "ID",
    "editable": false
}, {
    "name": "projectName",
    "value": "Project Name",
    "editable": false
}, {
    "name": "startDate",
    "value": "Start Date",
    "editable": false
}, {
    "name": "completionDate",
    "value": "Expected Date of Completion",
    "editable": false
}, {
    "name": "noofUnits",
    "value": "No. of Units",
    "editable": false
}, {
    "name": "EIC.fullName",
    "value": "EIC",
    "editable": false
}, {
    "name": "status",
    "value": "Status",
    "editable": false
}, {
    "name": "action",
    "value": "Action",
    "editable": true
}]
let employeeColumns = [{
    "name": "id",
    "value": "ID",
    "editable": false
}, {
    "name": "fullName",
    "value": "Name",
    "editable": false
}, {
    "name": "userType",
    "value": "Position",
    "editable": false
}, {
    "name": "action",
    "value": "Action",
    "editable": true
}];
let templatesColumns = [{
    "name": "templateName",
    "value": "Template",
    "editable": false
}, {
    "name": "createdAt",
    "value": "Date Created",
    "editable": false
}, {
    "name": "action",
    "value": "Action",
    "editable": true
}];
let inventoryColumns = [{
    "name": "id",
    "value": "ID",
    "editable": false
}, {
    "name": "item",
    "value": "Item",
    "editable": false
}, {
    "name": "stockQuantity",
    "value": "Stock Quantity",
    "editable": false
}, {
    "name": "status",
    "value": "Status",
    "editable": false
}, {
    "name": "lastUpdated",
    "value": "Last Updated",
    "editable": false
}, {
    "name": "action",
    "value": "Action",
    "editable": true
}]
let materialColumns = [{
    "name": "id",
    "value": "ID",
    "editable": false
}, {
    "name": "materialName",
    "value": "Material",
    "editable": false
}, {
    "name": "createdAt",
    "value": "Date Created",
    "editable": false
}, {
    "name": "action",
    "value": "Action",
    "editable": true
}];
let poColumns = [{
    "name": "id",
    "value": "ID",
    "editable": false
}, {
    "name": "supplier",
    "value": "Supplier",
    "editable": false
}, {
    "name": "dateOrdered",
    "value": "Date Ordered",
    "editable": false
}, {
    "name": "createdAt",
    "value": "Date Created",
    "editable": false
}, {
    "name": "orderedBy",
    "value": "Ordered By",
    "editable": false
}, {
    "name": "status",
    "value": "Status",
    "editable": false
}, {
    "name": "action",
    "value": "Action",
    "editable": true
}];
let poviewColumns = [{
    "name": "material",
    "value": "Material",
    "editable": false
}, {
    "name": "quantity",
    "value": "Quantity",
    "editable": false
}, {
    "name": "unit_price",
    "value": "Unit",
    "editable": false
}, {
    "name": "total_price",
    "value": "Total Price",
    "editable": false
}];
let posummaryColumns = [{
    "name": "date",
    "value": "Date",
    "editable": false
}, {
    "name": "category",
    "value": "Category",
    "editable": false
}, {
    "name": "category",
    "value": "Category",
    "editable": false
}, {
    "name": "description",
    "value": "Description",
    "editable": false
}, {
    "name": "quantity",
    "value": "Quantity",
    "editable": false
}, {
    "name": "unit",
    "value": "Unit",
    "editable": false
}, {
    "name": "unitCost",
    "value": "Unit Cost",
    "editable": false
}, {

}];
let popendingColumns = [{
    "name": "category",
    "value": "Category",
    "editable": false
}, {
    "name": "description",
    "value": "Description",
    "editable": false
}, {
    "name": "quantity",
    "value": "Quantity",
    "editable": false
}, {
    "name": "unit",
    "value": "Unit",
    "editable": false
}, {
    "name": "receivedQuantity",
    "value": "Received Quantity",
    "editable": false
}, {
    "name": "remainingQuantity",
    "value": "Remaining Quantity",
    "editable": false
}, {
    "name": "updateQuantity",
    "value": "Update Quantity",
    "editable": true
}];
let viewprojectsColumns = [{
    "name": "id",
    "value": "ID",
    "editable": false
},{
    "name": "createdAt",
    "value": "Date Created",
    "editable": false
}, {
    "name": "completionDate",
    "value": "Expected Completion Date",
    "editable": false
}, {
    "name": "template",
    "value": "Template",
    "editable": false
},{
    "name": "action",
    "value": "Action",
    "editable": true
}];
let requisitionColumns = [{
    "name": "id",
    "value": "ID",
    "editable": false
}, {
    "name": "description",
    "value": "Description",
    "editable": false
}, {
    "name": "createdAt",
    "value": "Date Created",
    "editable": false
}, {
    "name": "requisitionDate",
    "value": "Requisition Date",
    "editable": false
}, {
    "name": "quantity",
    "value": "Quantity",
    "editable": false
}, {
    "name": "unit",
    "value": "Unit",
    "editable": false
}, {
    "name": "projectUnit",
    "value": "Project Unit",
    "editable": false
}, {
    "name": "action",
    "value": "Action",
    "editable": true
}];
let bomColumns = [{
    "name": "material",
    "value": "Material",
    "editable": false
}, {
    "name": "quantity",
    "value": "Quantity",
    "editable": false
}, {
    "name": "unit",
    "value": "Unit",
    "editable": false
}, {
    "name": "quantityUsed",
    "value": "Quantity",
    "editable": false
}]
let viewrequisitionColumns = [{
    "name": "category",
    "value": "Category",
    "editable": false
}, {
    "name": "description",
    "value": "Description",
    "editable": false
}, {
    "name": "quantity",
    "value": "Quantity",
    "editable": false
}, {
    "name": "unit",
    "value": "Unit",
    "editable": false
}]
let purchaseReportColumn = [{
    "name": "material",
    "value": "Material",
    "editable": false
}, {
    "name": "quantity",
    "value": "Quantity",
    "editable": false
}, {
    "name": "unit",
    "value": "Unit",
    "editable": false
}, {
    "name": "quantityUsed",
    "value": "Phase 1 Quantity",
    "editable": false
}, {
    "name": "quantityUsed2",
    "value": "Phase 2 Quantity",
    "editable": false
}, {
    "name": "quantityUsed3",
    "value": "Phase 3 Quantity",
    "editable": false
}, {
    "name": "total",
    "value": "Total Quantity",
    "editable": false
}, {
    "name": "totalCost",
    "value": "total Cost",
    "editable": false
}]

let createtemplatesColumns = [{
	"name": "checkbox",
	"value": "",
	"editable": true
},{
	"name": "material",
	"value": "Material",
	"editable": true
},{
	"name": "quantity",
	"value": "Quantity",
	"editable": false
},{
	"name": "unit",
	"value": "Unit",
	"editable": false
}];

let editrequisitionColumns = [{
    "name": "category",
    "value": "Category",
    "editable": false
}, {
    "name": "description",
    "value": "Description",
    "editable": false
}, {
    "name": "quantity",
    "value": "Quantity",
    "editable": false
}, {
    "name": "unit",
    "value": "Unit",
    "editable": false
}, {
    "name": "Action",
    "value": "Action",
    "editable": true
}]

module.exports = {editrequisitionColumns, projectsColumns, createtemplatesColumns, employeeColumns,templatesColumns,inventoryColumns,materialColumns,poColumns,poviewColumns,posummaryColumns,popendingColumns,viewprojectsColumns,requisitionColumns,bomColumns,viewrequisitionColumns,purchaseReportColumn}