import Backbone from 'backbone';
import Backgrid from 'backgrid';
import Filter from 'backgrid-filter';
document.addEventListener("DOMContentLoaded", function () {

    let Employee = Backbone.Model.extend({});

    let Employees = Backbone.Collection.extend({

        model: Employee,
        url: "/api/employee"
    });

    let employees = new Employees();

    let ActionCell = Backgrid.Cell.extend({
        events: {
            'click button': 'editRow'
        },
        editRow: function(e) {
            e.preventDefault();
            console.log(this.model);
        },
        render: function () {
            this.$el.html('<button class="btn btn-default btn-sm"><i class="fas fa-pencil-alt"></i></button>');
            return this;
        }
    });

    let columns = [{
        name: "name",
        label: "Имя",
        cell: "string",
        editable: false
    }, {
        name: "gender",
        label: "Пол",
        cell: "string",
        editable: false
    }, {
        name: "age",
        label: "Возраст",
        cell: "string",
        editable: false
    }, {
        name: "position",
        label: "Должность",
        cell: "string",
        editable: false
    },{
        name: '',
        label: '',
        cell: ActionCell,
        editable: false
    }];


    let grid = new Backgrid.Grid({
        columns: columns,
        collection: employees
    });
    let $gridContainer = $("#employee-list");
    let $grid = $(grid.el);
    $gridContainer.append(grid.render().el);
    $grid.addClass('table table-hover');

    let filter = new Backgrid.Extension.ClientSideFilter({
        collection: employees,
        fields: ['name']
    });

    $('.filter-toolbar:first').append(filter.render().el);


    $(filter.el).addClass('form-inline').find('input:first').addClass('form-control');


// Fetch some countries from the url
    employees.fetch({reset: true});
    console.log(Backgrid);
});