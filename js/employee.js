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
            <td class="align-middle">${employee.group_id == 0 ? 'brak' : employee.group_id}</td>
            <td class="align-middle">
              <a href="#" class="btn btn-warning mr-3 editemployee add-edit" data-toggle="modal" data-target="#employeeModal"
                title="Edit" data-id="${employee.id}">Edit</a>
              <a href="#" class="btn btn-danger deletetemployee" data-id="${employee.id}" title="Delete" data-id="${employee.id}">Delete</a>
            </td>
          </tr>`;
    }
    return employeeRow;
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
    });
     
      // searching
    $("#searchinput").on("keyup", function () {
      const searchText = $(this).val();
      if (searchText.length > 1) {
        $.ajax({
          url: "/employee-management-system/ajax.php",
          type: "GET",
          dataType: "json",
          data: { searchQuery: searchText, action: "searchEmployee" },
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
     
    // add/edit user
    $(document).on("submit", "#addform", function (event) {
      event.preventDefault();
      var alertmsg =
        $("#employeeid").val().length > 0
          ? "Employee has been updated Successfully!"
          : "New employee has been added Successfully!";
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
            $("#employeeModal").modal("hide");
            $("#addform")[0].reset();
            $(".message").html(alertmsg).fadeIn().delay(3000).fadeOut();
            listemployee();
            $("#overlay").fadeOut();
          }
        },
        error: function () {
          console.log("Oops! Something went wrong!");
        },
      });
    });
     
    //get user
    $(document).on("click", "a.editemployee", function () {
      var empid = $(this).data("id");
   
      $.ajax({
        url: "/employee-management-system/ajax.php",
        type: "GET",
        dataType: "json",
        data: { id: empid, action: "getuser" },
        beforeSend: function () {
          $("#overlay").fadeIn();
        },
        success: function (employee) {
          if (employee) {
            $("#name").val(employee.name);
            $("#firstname").val(employee.firstname);
            $("#lastname").val(employee.lastname);
            $("#birthdate").val(employee.birthdate);
            $(".group-select").val(employee.group_id);
            $("#employeeid").val(employee.id);
          }
          $("#overlay").fadeOut();
        },
        error: function () {
          console.log("something went wrong");
        },
      });
    });
     
    // delete user
    $(document).on("click", "a.deletetemployee", function (e) {
      e.preventDefault();
      var pid = $(this).data("id");
      if (confirm("Are you sure want to delete this?")) {
        $.ajax({
          url: "/employee-management-system/ajax.php",
          type: "GET",
          dataType: "json",
          data: { id: pid, action: "deletetemployee" },
          beforeSend: function () {
            $("#overlay").fadeIn();
          },
          success: function (res) {
            if (res.deleted == 1) {
              $(".message")
                .html("employee has been deleted successfully!")
                .fadeIn()
                .delay(3000)
                .fadeOut();
              listemployee();
              $("#overlay").fadeOut();
            }
          },
          error: function () {
            console.log("something went wrong");
          },
        });
      }
    });
    listemployee();
    fillGroupsSelect();
  });