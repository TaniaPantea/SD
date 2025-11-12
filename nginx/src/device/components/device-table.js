import React from "react";
import Table from "../../commons/tables/table";
import * as API_DEVICES from "../api/device-api";
import { getUserRole } from "../../commons/auth/jwt-utils";

const filters = [
    {
        accessor: 'name',
    }
];

function DeviceTable(props) {

    const userRole = getUserRole();
    const isAdmin = userRole === 'ADMIN';

    function handleEdit(device) {
        API_DEVICES.getDeviceById({ id: device.id }, (result, status, err) => {
            if (result !== null && status === 200) {
                props.openEditForm(result);
            }
        });
    }

    function handleDelete(device) {
        if (!device || !device.name || !device.id) {
            console.error("Trying to delete an invalid device", device);
            alert("Error: device's detailes couldn't be identified");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${device.name}?`)) {
            API_DEVICES.deleteDevice(device.id, (result, status, err) => {
                if (status === 200 || status === 204) {
                    props.reloadDelete();
                } else {
                    alert("Error deleting device");
                }
            });
        }
    }

    const columns = [
        {
            Header: 'Device Name',
            accessor: 'name',
        },
        {
            Header: 'Max Consumption',
            accessor: 'maxConsumption',
        },
        {
            Header: 'Owner',
            accessor: 'userId',
            Cell: ({ value }) => {
                const user = props.users.find(u => u.id === value);
                return user ? user.username : value;
            }
        },
        {
            Header: 'Active',
            accessor: 'active',
            Cell: ({ value }) => (value ? 'Yes' : 'No')
        },
        {
            Header: 'Actions',
            Cell: function ( cellInfo ) {
                const device = cellInfo.original;
                if (!device) return <div> Date lipsa </div>;
                return (
                    <div>
                        {isAdmin && (
                            <>
                                <button onClick={() => handleEdit(device)}>Edit</button>
                                <button onClick={() => handleDelete(device)}>Delete</button>
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

export default DeviceTable;
