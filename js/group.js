// get pagination
function pagination(totalpages, currentpage) {
    var pagelist = "";
    if (totalpages > 1) {
      currentpage = parseInt(currentpage);
      pagelist += `<ul class="pagination justify-content-center">`;
      const prevClass = currentpage == 1 ? " disabled" : "";
      pagelist += `<li class="page-item${prevClass}"><a class="page-link" href="#" data-page="${
        currentpage - 1
      }">Previous</a></li>`;
      for (let p = 1; p <= totalpages; p++) {
        const activeClass = currentpage == p ? " active" : "";
        pagelist += `<li class="page-item${activeClass}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
      }
      const nextClass = currentpage == totalpages ? " disabled" : "";
      pagelist += `<li class="page-item${nextClass}"><a class="page-link" href="#" data-page="${
        currentpage + 1
      }">Next</a></li>`;
      pagelist += `</ul>`;
    }
   
    $("#pagination").html(pagelist);
  }

   // get group row
   function getgrouprow(group) {
    var groupRow = "";
    if (group) {
      groupRow = `<tr>
            <td class="align-middle">${group.id}</td>
            <td class="align-middle">${group.name}</td>
            <td class="align-middle">
              <a href="#" class="btn btn-warning mr-3 editgroup add-edit" data-toggle="modal" data-target="#groupModal"
                title="Edit" data-id="${group.id}">Edit</a>
              <a href="#" class="btn btn-danger deletegroup" data-id="${group.id}" title="Delete" data-id="${group.id}">Delete</a>
            </td>
          </tr>`;
    }
    return groupRow;
  }

  // fills employees select in modal form
  function fillEmployeesSelect() {
  $.ajax({
      url: "/employee-management-system/ajax.php",
      type: "GET",
      dataType: "json",
      data: {action: "getallemployees" },
      success: function (employees) {
          if (employees) {
              $.each(employees, function (index, employee) {
                  $("#addform .employee-select").append(`<option value="${employee.id}">${employee.name}</option>`);
              });
          }
          $("#overlay").fadeOut();
      },
      error: function () {
          console.log("something went wrong");
      },
      });
  }
   
  function listgroups() {
    var pageno = $("#currentpage").val();
    $.ajax({
      url: "/employee-management-system/ajax.php",
      type: "GET",
      dataType: "json",
      data: { page: pageno, action: "getgroups" },
      beforeSend: function () {
        $("#overlay").fadeIn();
      },
      success: function (rows) {
        console.log(rows);  
        if (rows.jsongroup) { 
          var groupslist = "";
          $.each(rows.jsongroup, function (index, group) {
            groupslist += getgrouprow(group);
          });
          $("#groupstable tbody").html(groupslist);
          let totalgroups = rows.count;
          let totalpages = Math.ceil(parseInt(totalgroups) / 4);
          const currentpage = $("#currentpage").val();
          pagination(totalpages, currentpage);
          $("#overlay").fadeOut();
        }
      },
      error: function () {
        console.log("something went wrong");
      },
    });
  }
   
   
  $(document).ready(function () {
    // pagination
    $(document).on("click", "ul.pagination li a", function (e) {
      e.preventDefault();
      var $this = $(this);
      const pagenum = $this.data("page");
      $("#currentpage").val(pagenum);
      listgroups();
      $this.parent().siblings().removeClass("active");
      $this.parent().addClass("active");
    });
    // form reset on new button
    $("#addnewbtn").on("click", function () {
      $("#addform")[0].reset();
      $("#groupid").val("");
    });
     
      // searching
    $("#searchinput").on("keyup", function () {
      const searchText = $(this).val();
      if (searchText.length > 1) {
        $.ajax({
          url: "/employee-management-system/ajax.php",
          type: "GET",
          dataType: "json",
          data: { searchQuery: searchText, action: "search" },
          success: function (employees) {
            if (employees) {
              var employeeslist = "";
              $.each(employees, function (index, employee) {
                employeeslist += getemployeerow(employee);
              });
              $("#employeetable tbody").html(employeeslist);
              $("#pagination").hide();
            }
          },
          error: function () {
            console.log("something went wrong");
          },
        });
      } else {
        listemployee();
        $("#pagination").show();
      }
    });
     
    // add/edit group
    $(document).on("submit", "#addform", function (event) {
      event.preventDefault();
      var alertmsg =
        $("#groupid").val().length > 0
          ? "Group has been updated Successfully!"
          : "New group has been added Successfully!";
      

      $.ajax({
        url: "/employee-management-system/ajax.php",
        type: "POST",
        dataType: "json",
        data:  new FormData(this),
        processData: false,
        contentType: false,
        beforeSend: function () {
          $("#overlay").fadeIn();
        },
        success: function (response) {
          if (response) {
            $("#groupModal").modal("hide");
            $("#addform")[0].reset();
            $(".message").html(alertmsg).fadeIn().delay(3000).fadeOut();
            listgroups();
            $("#overlay").fadeOut();
          }
        },
        error: function () {
          console.log("Oops! Something went wrong!");
        },
      });
    });

    //get group
    $(document).on("click", "a.editgroup", function () {
      let groupid = $(this).data("id");
      let employeeContainer = $('#addform .group-employees');
      let idsContainer =  $('#addform #employee-ids');
      console.log(idsContainer);
      $(employeeContainer).empty();
      $(idsContainer).val('');

      $.ajax({
        url: "/employee-management-system/ajax.php",
        type: "GET",
        dataType: "json",
        data: { id: groupid, action: "getgroup" },
        beforeSend: function () {
          $("#overlay").fadeIn();
        },
        success: function (group) {
          console.log(group);
          if (group) {
            $("#name").val(group.name);
            $("#groupid").val(group.id);
            for(i=0;i<group.employees.length;i++){
              $(employeeContainer).append(`<div class="employee" id="${group.employees[i].id}"><div>${group.employees[i].name}</div><div class="delete-group-employee">x</div></div>`);
              $(idsContainer).val($(idsContainer).val() + group.employees[i].id +',');
            }
          }
         
          $("#overlay").fadeOut();
        },
        error: function () {
          console.log("something went wrong");
        },
      });
    });

    $('#addform .employee-select').on('change', function(){
        let choice = $(this).find(":selected");
        let employeeContainer = $('#addform .group-employees');
        if($(employeeContainer).find(`div[id='${$(choice).val()}']`).length !== 0){
        }
        else{
          $(employeeContainer).append(`<div class="employee" id="${$(choice).val()}"><div>${$(choice).text()}</div><div class="delete-group-employee">x</div></div>`);
          $('#addform #employee-ids').val($('#addform #employee-ids').val() + $(choice).val()+',');
        }
    });

    $('#addform').on('click', '.delete-group-employee', function(){
      let employee = $(this).closest('.employee');
      let employeeId = $(employee).attr('id');
      $(employee).remove();
      let ids = $('#employee-ids').val();
      let idsArray = ids.split(',');
      const index = idsArray.indexOf(employeeId);
      if (index > -1) {
        idsArray.splice(index, 1);
      }
      $('#employee-ids').val(idsArray.join(','));

    });

    // delete group
    $(document).on("click", "a.deletegroup", function (e) {
      e.preventDefault();
      var pid = $(this).data("id");
      if (confirm("Are you sure want to delete this?")) {
        $.ajax({
          url: "/employee-management-system/ajax.php",
          type: "GET",
          dataType: "json",
          data: { id: pid, action: "deletegroup" },
          beforeSend: function () {
            $("#overlay").fadeIn();
          },
          success: function (res) {
            if (res.deleted == 1) {
              $(".message")
                .html("group has been deleted successfully!")
                .fadeIn()
                .delay(3000)
                .fadeOut();
              listgroups();
              $("#overlay").fadeOut();
            }
          },
          error: function () {
            console.log("something went wrong");
          },
        });
      }
    });

    listgroups();
    fillEmployeesSelect();
  });