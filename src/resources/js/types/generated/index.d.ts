declare namespace App.Domains.Permission.DTOs {
export type PermissionData = {
id: number;
name: string;
guard_name: string;
created_at: string | null;
};
}
declare namespace App.Domains.Role.DTOs {
export type RoleData = {
id: number;
name: string;
guard_name: string;
users_count: number;
permissions: Array<any>;
created_at: string | null;
};
}
declare namespace App.Domains.User.DTOs {
export type UserData = {
id: number;
name: string;
email: string;
created_at: string | null;
roles: { [key: number]: string };
};
}
