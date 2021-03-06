<!-- add/edit form modal -->
<div class="modal fade" id="groupModal" tabindex="-1" role="dialog" aria-labelledby="groupModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add/Edit Group</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <form id="addform" method="POST" enctype="multipart/form-data">
        <div class="modal-body">
          <div class="form-group">
            <label for="recipient-name" class="col-form-label">Name:</label>
            <div class="input-group mb-3">
              <input type="text" class="form-control" id="name" name="name" required="required">
            </div>
          </div>
          <div class="form-group">
            <label for="message-text" class="col-form-label">Add employee (if you add employee that already has group, it will automatically change his group)</label>
            <div class="input-group mb-3">
              <select class="employee-select form-select w-100" name="group" id="group">
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="message-text" class="col-form-label">Employees in group:</label>
            <div class="input-group group-employees mb-3 w-100">

            </div>
          </div>
          <div class="form-group" style="display:none">
            <div class="input-group group-employees-ids">
            <input type="text" class="form-control" id="employee-ids" name="employee-ids" >  
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-success" id="addButton">Submit</button>
          <input type="hidden" name="action" value="addnewGroup">
          <input type="hidden" name="groupid" id="groupid" value="">
        </div>
      </form>
    </div>
  </div>
</div>
<!-- add/edit form modal end -->