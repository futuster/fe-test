import Backbone from 'backbone';
import Backgrid from 'backgrid';
import Filter from 'backgrid-filter';

let oldCollectionFetch = Backbone.Collection.prototype.fetch;

Backbone.Collection.prototype.fetch = function(options) {
    this.trigger("fetch:started");
    oldCollectionFetch.call(this, options);
};

let Employee = Backbone.Model.extend({
    url: "/api/employee/store"
});
let Employees = Backbone.Collection.extend({
    model: Employee,
    url: "/api/employee",
    events: {
        "fetch:started": "onFetch"
    },
    onFetch: function(){
        console.log('fetch');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let employees = new Employees();

    let ActionCell = Backgrid.Cell.extend({
        events: {
            'click button': 'editRow'
        },
        editRow: function (e) {
            e.preventDefault();
            let self = this;
            // тут будет течь память, но в рамках тестового задания это не критично
            employeeFormView.undelegateEvents();
            employeeFormView = new FormView({model: this.model});

            $('#employee-form').modal('show');

            $('#employee-form .employee-remove').show(0)
                .on('click', function(){
                    $('#employee-form').modal('hide');
                    self.model.destroy();
                });

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
    }, {
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

    // загружаем список сотрудников
    employees.fetch({reset: true});


    let FormView = Backbone.View.extend({
        el: $("#employee-form"),
        events: {
            "submit": "store"
        },
        initialize: function () {
            let self = this;
            let $el = $(this.el);

            /*
            обычно в формах проще использовать two way data binding
            options.silent = true;
            uiSet -> uiChange = true;
            но это не наш вариант
             */
            this.$name = $el.find("input[name='name']");
            this.$name.val(this.model.get('name'));

            this.$position = $el.find("[name='position']");
            this.$position.val(this.model.get('position'));

            this.$age = $el.find("[name='age']");
            this.$age.val(this.model.get('age'));

            this.$gender = $el.find("[name='gender']");
            this.$gender.val(this.model.get('gender'));

            // прячем кнопку удалить
            $el.find('.employee-remove').hide(0);

        },
        store: function (e, method) {
            e.preventDefault();
            let $el = $(this.el);

            this.model.set({'name': $el.find("input[name='name']").val()});
            this.model.set({'position': $el.find("[name='position']").val()});
            this.model.set({'age': $el.find("[name='age']").val()});
            this.model.set({'gender': $el.find("[name='gender']").val()});


            this.model.save();
            employees.add(this.model);
            employees.trigger('update');
            $('#employee-form').modal('hide');
        }
    });

    let employeeFormView = new FormView({model: new Employee()});

    // сбрасываем модель при закрытии формы
    $('#employee-form').on('hidden.bs.modal', function (e) {
        // тут будет течь память, но в рамках тестового задания это не критично
        employeeFormView.undelegateEvents();
        employeeFormView = new FormView({model: new Employee()});
    });

});