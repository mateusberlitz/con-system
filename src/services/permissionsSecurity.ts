interface Permission{
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

interface encodedPermission{
    name: string;
}

interface SimplePermission{
    name: string;
}

export const encodePermissions = (permissions: SimplePermission[]) => {
    const encodedPermissions = permissions.map(permission => {
        return {
            name: btoa(permission.name),
        }
    });

    return encodedPermissions;
};


export const decodePermissions = (encodedPermissions : encodedPermission[]) => {
    const decodedPermissions = encodedPermissions.map(permission => {
        return {
            name: atob(permission.name),
        }
    });

    return decodedPermissions;
}

export const simplifyPermissions = (permissions: Permission[]):SimplePermission[] =>{
    const simplifiedPermissions = permissions.map(permission => {
        return {
            name: permission.name,
        }
    });

    return simplifiedPermissions;
};