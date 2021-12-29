<?php
require_once 'Db.php';
 
class Employee extends Database
{
    // table name
    protected $tableName = 'employee';
 
    //function is used to add record
    public function add($data)
    {
        if (!empty($data)) {
            $fileds = $placholders = [];
            foreach ($data as $field => $value) {
                $fileds[] = $field;
                $placholders[] = ":{$field}";
            }
        }
 
        $sql = "INSERT INTO {$this->tableName} (" . implode(',', $fileds) . ") VALUES (" . implode(',', $placholders) . ")";
        $stmt = $this->conn->prepare($sql);
        try {
            $this->conn->beginTransaction();
            $stmt->execute($data);
            $lastInsertedId = $this->conn->lastInsertId();
            $this->conn->commit();
            return $lastInsertedId;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            $this->conn->rollback();
        }
 
    }
 
    //function update record
    public function update($data, $id)
    {
        if (!empty($data)) {
            $fileds = '';
            $x = 1;
            $filedsCount = count($data);
            foreach ($data as $field => $value) {
                $fileds .= "{$field}=:{$field}";
                if ($x < $filedsCount) {
                    $fileds .= ", ";
                }
                $x++;
            }
        }
        $sql = "UPDATE {$this->tableName} SET {$fileds} WHERE id=:id";
        $stmt = $this->conn->prepare($sql);
        try {
            $this->conn->beginTransaction();
            $data['id'] = $id;
            $stmt->execute($data);
            $this->conn->commit();
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            $this->conn->rollback();
        }
 
    }
 
    //function to get records
 
    public function getRows($start = 0, $limit = 4)
    {
        $sql = "SELECT * FROM {$this->tableName} ORDER BY id DESC LIMIT {$start},{$limit}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
 
            $results = [];
        }
        return $results;
    }
 
    // delete row using id
    public function deleteRow($id)
    {
        $sql = "DELETE FROM {$this->tableName}  WHERE id=:id";
        $stmt = $this->conn->prepare($sql);
        try {
            $stmt->execute([':id' => $id]);
            if ($stmt->rowCount() > 0) {
                return true;
            }
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
 
    }
 
    public function getCount()
    {
        $sql = "SELECT count(*) as pcount FROM {$this->tableName}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['pcount'];
    }
     
    //function to get single record based on the column value
    public function getRow($field, $value)
    {
        $sql = "SELECT * FROM {$this->tableName}  WHERE {$field}=:{$field}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([":{$field}" => $value]);
        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $result = [];
        }
 
        return $result;
    }
 
 
    //function for search table fields name
    public function searchEmployee($searchText, $start = 0, $limit = 4)
    {
        $sql = "SELECT * FROM {$this->tableName} WHERE name LIKE :search ORDER BY id DESC LIMIT {$start},{$limit}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':search' => "%{$searchText}%"]);
        if ($stmt->rowCount() > 0) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $results = [];
        }
 
        return $results;
    }

    //function to get groups for select in modal form
    public function getEmployees()
    {
        $sql = "SELECT * FROM {$this->tableName} ORDER BY id ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
    
            $results = [];
        }
        return $results;
    }

    public function updateGroup($id, $groupId){
        $sql = "UPDATE {$this->tableName} SET group_id={$groupId} WHERE id={$id}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
    
            $results = [];
        }
        return $results;
    }

    public function getEmployeesByGroup($groupId){
        $sql = "SELECT * FROM {$this->tableName} WHERE group_id = {$groupId}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
 
            $results = [];
        }
        return $results;
    }

    public function clearGroup($groupId){
        $sql = "UPDATE {$this->tableName} SET group_id = '' WHERE group_id = {$groupId}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
 
            $results = [];
        }
        return $results;
    }

} //End Class Employee