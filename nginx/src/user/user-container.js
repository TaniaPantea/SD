import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_USERS from "./api/user-api";
import UserTable from "./components/user-table";
import EditUserForm from './components/edit-user-form';
import { getUserRole } from "../commons/auth/jwt-utils";

function UserContainer(props) {
    const [isSelected, setIsSelected] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)

    const userRole = getUserRole();
    const isAdmin = userRole === 'ADMIN';
    const [error, setError] = useState({ status: 0, errorMessage: null });

    // componentDidMount
    useEffect(() => {
        fetchUsers();
    }, []);

    function fetchUsers() {
        return API_USERS.getUsers((result, status, err) => {
            if (result !== null && status === 200) {
                setTableData((tableData) => (result));
                setIsLoaded((isLoaded) => (true));
            } else {
                setError((error) => ({ status: status, errorMessage: err }));
            }
        });
    }

    function reload() {
        setIsLoaded(false);
        setSelectedUser(null);
        setIsSelected(false);
        fetchUsers();
    }

    function openEditForm(user) {
        setSelectedUser(user);
        setIsSelected(true);
    }


    return (
        <div>
            <CardHeader>
                <strong> User Management </strong>
            </CardHeader>
            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        {/*{isAdmin && (*/}
                        {/*    <Button color="primary" onClick={toggleForm}>Add User </Button>*/}
                        {/*)}*/}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        {isLoaded && <UserTable tableData={tableData} openEditForm={openEditForm} reloadHandler={reload} />}
                        {error.status > 0 &&
                            <APIResponseErrorMessage
                                errorStatus={error.status}
                                error={error.errorMessage}
                            />}
                    </Col>
                </Row>
            </Card>

            <Modal isOpen={isSelected} toggle={() => setIsSelected(false)} size="lg">
                <ModalHeader toggle={() => setIsSelected(false)}>
                    Edit User
                </ModalHeader>
                <ModalBody>
                    <EditUserForm reloadHandler={reload} user={selectedUser} />
                </ModalBody>
            </Modal>


        </div>
    );

}

export default UserContainer;
