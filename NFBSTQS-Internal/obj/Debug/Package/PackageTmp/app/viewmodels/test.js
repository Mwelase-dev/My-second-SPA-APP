define(['plugins/dialog', 'knockout', 'jquery'], function (dialog, ko, $) {
    function mainVm() {
        var self = this;
        this.myData = ko.observableArray([{ name: "Moroni", age: 50 },
                                          { name: "Tiancum", age: 43 },
                                          { name: "Jacob", age: 27 },
                                          { name: "Nephi", age: 29 },
                                          { name: "Enos", age: 34 }]);
        this.gridOptions = { data: self.myData };
    };
    //ko.applyBindings(new mainVm());
 
    //var activate = function() {
    //    //mainVm();
    //}
    //var vm = {
    //    activate: activate 
      
    //};

    //return vm;

});
