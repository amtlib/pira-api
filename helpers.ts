import { Lists } from ".keystone/types";
import { KeystoneContextFromListTypeInfo } from "@keystone-6/core/types";

export const isAdmin = async (email: string, context: KeystoneContextFromListTypeInfo<Lists.User.TypeInfo>) => {
  // return true;  
  const { isAdmin: isAdminField } = await context.query.User.findOne({
        where: {
          email: email
        },
        query: 'isAdmin'
      });
  return true;
  return isAdminField;
}