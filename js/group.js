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
   
  // get employee row
  function getemployeerow(employee) {
    var employeeRow = "";
    if (employee) {
      employeeRow = `<tr>
            <td class="align-middle">${employee.name}</td>
            <td class="align-middle">${employee.firstname}</td>
            <td class="align-middle">${employee.lastname}</td>
            <td class="align-middle">${employee.birthdate}</td>
            <td class="align-middle">${employee.group_id}</td>
            <td class="align-middle">
              <a href="#" class="btn btn-warning mr-3 editemployee add-edit" data-toggle="modal" data-target="#employeeModal"
                title="Edit" data-id="${employee.id}">Edit</a>
              <a href="#" class="btn btn-danger deletetemployee" data-id="${employee.id}" title="Delete" data-id="${employee.id}">Delete</a>
            </td>
          </tr>`;
    }
    return employeeRow;
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

    // fills groups select in modal form
    function fillGroupsSelect() {
    $.ajax({
        url: "/employee-management-system/ajax.php",
        type: "GET",
        dataType: "json",
        data: {action: "getallgroups" },
        success: function (groups) {
            if (groups) {
                $.each(groups, function (index, group) {
                    console.log(group);
                    $("#addform .group-select").append(`<option value="${group.id}">${group.name}</option>`);
                });
            }
            $("#overlay").fadeOut();
        },
        error: function () {
            console.log("something went wrong");
        },
        });
    }
   
  // get employees list
  function listemployee() {
    var pageno = $("#currentpage").val();
    $.ajax({
      url: "/employee-management-system/ajax.php",
      type: "GET",
      dataType: "json",
      data: { page: pageno, action: "getusers" },
      beforeSend: function () {
        $("#overlay").fadeIn();
      },
      success: function (rows) {
        console.log(rows);  
        if (rows.jsonemplyee) { 
          var employeeslist = "";
          $.each(rows.jsonemplyee, function (index, employee) {
            employeeslist += getemployeerow(employee);
          });
          $("#employeetable tbody").html(employeeslist);
          let totalemployees = rows.count;
          let totalpages = Math.ceil(parseInt(totalemployees) / 4);
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
      listemployee();
      $this.parent().siblings().removeClass("active");
      $this.parent().addClass("active");
    });
    // form reset on new button
    $("#addnewbtn").on("click", function () {
      $("#addform")[0].reset();
      $("#employeeid").val("");
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
        data: new FormData(this),
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
    listgroups();

  });