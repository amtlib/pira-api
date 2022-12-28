import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { isAdmin } from "./helpers";

import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  checkbox,
  virtual,
} from '@keystone-6/core/fields';

import type { Lists } from '.keystone/types';
import { graphql } from '@graphql-ts/schema';

export const lists: Lists = {
  User: list({
    fields: {
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),

      isAdmin: checkbox({
        defaultValue: false
      }),

      password: password({ validation: { isRequired: true } }),

      firstName: text({
        validation: {
          isRequired: true
        }
      }),
      lastName: text({
        validation: {
          isRequired: true
        }
      }),
      createdTasks: relationship({ ref: 'Task.createdBy', many: true, ui: {labelField: 'name'} }),
      assignedTasks: relationship({ ref: 'Task.assignedUser', many: true, ui: {labelField: 'name'} }),
    },
    access: {
      operation: {
        create: allowAll,
        query: allowAll,
        update: async ({ session, context, listKey, operation }) => {
          return await isAdmin(session.data.email, context);
        },
        delete: async ({ session, context, listKey, operation }) => {
          return await isAdmin(session.data.email, context);
        }
      }
    },
  }),
  AssigneeUser: list({
    access: allowAll,
    fields: {
      project: relationship({ ref: 'Project', ui: {labelField: 'title'} }),
      user: relationship({ ref: 'User', ui: {labelField: 'email'} }),
      role: select({
        type: 'enum',
        options: [
          { label: "Administrator", value: "admin" },
          { label: "Kierownik", value: "manager" },
          { label: "Klient", value: "client" },
          { label: "Uzytkownik", value: "user" },
        ]
      })
    }
  }),
  Project: list({
    access: allowAll,

    fields: {
      title: text({
        validation: {
          isRequired: true
        }
      }),
      description: text({
        validation: {
          isRequired: true
        }
      }),
      tasks: relationship({ ref: 'Task.project', many: true, ui: { labelField: 'name'} })
    }
  }),
  Task: list({
    access: allowAll,
    fields: {
      project: relationship({ ref: 'Project.tasks', ui: {labelField: 'title'} }),
      createdBy: relationship({ ref: 'User.createdTasks', ui: {labelField: 'email'} }),
      assignedUser: relationship({ ref: 'User.assignedTasks', ui: {labelField: 'email'} }),
      dueDate: timestamp(),
      estimatedTime: integer(),
      priority: select({
        type: 'enum',
        options: [
          { label: "High", value: "high" },
          { label: "Medium", value: "medium" },
          { label: "Low", value: "low" },
        ]
      }),
      name: text(),
      description: text(),
      status: select({
        type: "enum",
        options: [
          { label: "Backlog", value: "backlog" },
          { label: "In development", value: "in_development" },
          { label: "In testing", value: "in_testing" },
          { label: "In approval", value: "in_approval" },
          { label: "Done", value: "done" },
        ],
        defaultValue: 'backlog'
      }),
      parentTask: relationship({ ref: 'Task' })
    }
  })

};
