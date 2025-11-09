import React from "react";
import * as API_USERS from '../api/user-api'
import Table from "../../commons/tables/table";



const filters = [
    {
        accessor: 'username',
    }
];

function UserTable(props) {
    function handleEdit(user) {
        API_USERS.getUserById({ id: user.id }, (result, status, err) => {
            if (result !== null && status === 200) {
                props.openEditForm(result);
            }
        });
    }

    function handleDelete(user) {
        if (!user || !user.username || !user.id) {
            console.error("Tentativă de ștergere a unui utilizator invalid:", user);
            alert("Eroare: Nu s-au putut identifica detaliile utilizatorului.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
            API_USERS.deleteUser(user.id, (result, status, err) => {
                if (status === 200) {
                    props.reloadHandler();
                } else {
                    alert("Error deleting user");
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
                    console.error("cellInfo.row.original este undefined pentru acest rând.", cellInfo);
                    return <div> Date lipsă </div>; // Afișăm un mesaj de eroare vizibil
                }
                return (
                    <div>
                        <button onClick={() => { handleEdit(user) }}>Edit</button>
                        <button onClick={() => { handleDelete(user) }}>Delete</button>
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