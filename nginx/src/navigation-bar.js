import React from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavLink, UncontrolledDropdown } from 'reactstrap';

import logo from './commons/images/icon.png';
import { useHistory } from 'react-router-dom';
import { logout, getUserRole } from './commons/auth/jwt-utils';

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

function NavigationBar() {
    const history = useHistory();
    const role = getUserRole();
    const isAuthenticated = !!role;

    function handleLogout() {
        logout();
        history.push('/auth');
    }

    return (
        <div>
            <Navbar color="dark" light expand="md">
                <NavbarBrand href="/">
                    <img src={logo} width={"50"}
                        height={"35"} />
                </NavbarBrand>
                <Nav className="mr-auto" navbar>

                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle style={textStyle} nav caret>
                            Menu
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                <NavLink href="/User">Users</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink href="/devices">Devices</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink href="/monitoring">Monitoring</NavLink>
                            </DropdownItem>
                            {role === 'ADMIN' && (
                                <DropdownItem>
                                    <NavLink href="/admin-chat">User support</NavLink>
                                </DropdownItem>
                            )}

                        </DropdownMenu>

                    </UncontrolledDropdown>

                </Nav>
                <Nav navbar>
                    {isAuthenticated ? (
                        <NavLink href="#" onClick={handleLogout} style={textStyle}>
                            Logout ({role})
                        </NavLink>
                    ) : (
                        <NavLink href="/auth" style={textStyle}>
                            Login
                        </NavLink>
                    )}
                </Nav>

            </Navbar>
        </div>
    );
}

export default NavigationBar;
