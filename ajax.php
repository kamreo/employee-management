<?php
$action = $_REQUEST['action'];
 
if (!empty($action)) {
    require_once 'Employee.php';
    require_once 'Group.php';
    $employeeObj = new Employee();
    $groupObj = new Group();
}

//users
if ($action == 'addnewEmployee' && !empty($_POST)) {
    $name = $_POST['name'];
    $password =   password_hash($_POST['password'], PASSWORD_BCRYPT);
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $birthdate = date("Y-m-d", strtotime($_POST['birthdate']));
    $group = $_POST['group'];
    $employeeID = (!empty($_POST['employeeid'])) ? $_POST['employeeid'] : '';

    $employeeData = [
        'name' => $name,
        'password' => $password,
        'firstname' => $firstname,
        'lastname' => $lastname,
        'birthdate' => $birthdate,
        'group_id' => $group
    ];
 
    if ($employeeID) {
        $employeeObj->update($employeeData, $employeeID);
    } else {
        $employeeID = $employeeObj->add($employeeData);
    }
 
    if (!empty($employeeID)) {
        $employeejson = $employeeObj->getRow('id', $employeeID);
        echo json_encode($employeejson);
        exit();
    }
}

if ($action == "getusers") {
    $page = (!empty($_GET['page'])) ? $_GET['page'] : 1;
    $limit = 4;
    $start = ($page - 1) * $limit;
 
    $employee = $employeeObj->getRows($start, $limit);
    if (!empty($employee)) {
        $employeelist = $employee;
    } else {
        $employeelist = [];
    }
    $total = $employeeObj->getCount();
    $empjson = ['count' => $total, 'jsonemplyee' => $employeelist];
    echo json_encode($empjson);
    exit();
}
 
if ($action == "getuser") {
    $employeeID = (!empty($_GET['id'])) ? $_GET['id'] : '';
    if (!empty($employeeID)) {
        $employeejsongetuser = $employeeObj->getRow('id', $employeeID);
        echo json_encode($employeejsongetuser);
        exit();
    }
}
 
if ($action == "deletetemployee") {
    $employeeID = (!empty($_GET['id'])) ? $_GET['id'] : '';
    if (!empty($employeeID)) {
        $isDeleted = $employeeObj->deleteRow($employeeID);
        if ($isDeleted) {
            $message = ['deleted' => 1];
        } else {
            $message = ['deleted' => 0];
        }
        echo json_encode($message);
        exit();
    }
}
 
if ($action == 'search') {
    $queryString = (!empty($_GET['searchQuery'])) ? trim($_GET['searchQuery']) : '';
    $results = $employeeObj->searchEmployee($queryString);
    echo json_encode($results);
    exit();
}

//groups
if ($action == 'addnewGroup' && !empty($_POST)) {
    $name = $_POST['name'];
    $groupID = (!empty($_POST['groupid'])) ? $_POST['groupid'] : '';

    $groupData = [
        'name' => $name,
    ];
 
    if ($groupID) {
        $groupObj->update($groupData, $groupID);
    } else {
        $groupID = $groupObj->add($groupData);
    }
 
    if (!empty($groupID)) {
        $groupjson = $groupObj->getRow('id', $groupID);
        echo json_encode($groupjson);
        exit();
    }
}

if ($action == "getallgroups") {
    $groups = $groupObj->getGroups();
    echo json_encode($groups);
    exit();
}

if ($action == "getgroups") {
    $page = (!empty($_GET['page'])) ? $_GET['page'] : 1;
    $limit = 4;
    $start = ($page - 1) * $limit;
 
    $groups = $groupObj->getRows($start, $limit);
    if (!empty($groups)) {
        $groupslist = $groups;
    } else {
        $groupslist = [];
    }
    $total = $groupObj->getCount();
    $groupjson = ['count' => $total, 'jsongroup' => $groupslist];
    echo json_encode($groupjson);
    exit();
}
 
