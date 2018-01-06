define(['knockout', 'services/datacontext', 'durandal/app','toastr'],
    function (ko, dtx, app, toastr) {
        var sections = ko.observableArray();
      
        function activate() {
            return dtx.getSectionsForDropdown().then(function (result) {
                sections(result);
            });
        }

        function getSections() {
            return dtx.getSectionsForDropdown().then(function (result) {
                sections(result);
            });
        }
         
        function getSectionToModify(section) {
            var objectToSend = JSON.stringify(section);

            localStorage.setItem('TheSection', objectToSend);
            localStorage.setItem('TheSectionId', section.SectionId);
            localStorage.setItem('TheSectionName', section.SectionName);
            window.location.href = '#/addnewSection';
        }

        var removeSection = function (section) {
            return app.showMessage('Are you sure you want remove this section and all of its children', 'Removing', ['Yes', 'No']).then(function(result) {
                if (result === "Yes") {
                    sections.remove(section);
                    dtx.deleteSection(section.SectionId);
                    toastr.success("Section deleted");
                }
            });
        }

        $(window).unload(function () {
            localStorage.removeItem("TheSectionId");
            sessionStorage.removeItem("TheSectionName");
           
        });
         
        var vm = {
            activate: activate,
            sections: sections,

            getSections: getSections,
        
            getSectionToModify: getSectionToModify,
            removeSection: removeSection,
        
        };
        return vm;
    });