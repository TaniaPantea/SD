import React from "react";
import * as API_USERS from '../api/user-api'
import Table from "../../commons/tables/table";
import { getUserRole } from "../../commons/auth/jwt-utils";
import * as API_AUTH from '../../auth/api/auth-api';


const filters = [
    {
        accessor: 'username',
    }
];

function UserTable(props) {
    const userRole = getUserRole();
    const isAdmin = userRole === 'ADMIN';

    function handleEdit(user) {
        API_USERS.getUserById({ id: user.id }, (result, status, err) => {
            if (result !== null && status === 200) {
                props.openEditForm(result);
            }
        });
    }

    function handleDelete(user) {
        if (!user || !user.username || !user.id) {
            console.error("Trying to delete an invalid user: ", user);
            alert("error: user's detailes could not be found.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
            API_USERS.deleteUser(user.id, (result, status, err) => {
                if (status === 204) {
                    API_AUTH.deleteUser(user.id, (result, status, err) => {
                        if (status === 204) {
                            props.reloadHandler();
                        }
                        else {
                            alert("Error deleting user in backend auth");
                        }
                    })
                } else {
                    alert("Error deleting user in backend user");
                }
            });
        }
    }

    const columns = [
        {
            Header: 'Username',
            accessor: 'username',
        },
        {
            Header: 'Age',
            accessor: 'age',
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Address',
            accessor: 'address',
        },
        {
            Header: 'Actions',
            Cell: function(cellInfo) {
                const user = cellInfo.original;
                if (!user) {
                    console.error("this line does not have data", cellInfo);
                    return <div> Date lipsa </div>;
                }
                return (
                    <div>
                        {isAdmin && (
                            <>
                                <button onClick={() => { handleEdit(user) }}>Edit</button>
                                <button onClick={() => { handleDelete(user) }}>Delete</button>
                            </>
                        )}
                        {!isAdmin && <span> - </span>}
                    </div>
                );
            }
        }
    ];

    return (
        <Table
            data={props.tableData}
            columns={columns}
            search={filters}
            pageSize={20}
        />
    );
}

export default UserTable;