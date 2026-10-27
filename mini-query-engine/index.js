
const employees = [
      { id: 1, name: "Aarav", department: "Engineering", salary: 70000 },
        { id: 2, name: "Diya", department: "Design", salary: 55000 },
          { id: 3, name: "Kabir", department: "Engineering", salary: 90000 },
            { id: 4, name: "Meera", department: "Marketing", salary: 45000 },
              { id: 5, name: "Rohan", department: "Engineering", salary: 65000 },
                { id: 6, name: "Anaya", department: "Design", salary: 60000 }
];

console.log(employees);




function query(data) {
      let result = [...data];

        return {
                where(condition) {
                          result = result.filter(condition);
                                return this;
                },

                    orderBy(field, direction = "asc") {
                              result.sort((a, b) => {
                                        if (a[field] < b[field]) {
                                                      return direction === "desc" ? 1 : -1;
                                        }

                                                if (a[field] > b[field]) {
                                                              return direction === "desc" ? -1 : 1;
                                                }

                                                        return 0;
                                            });

                                                  return this;
                                        },

                                            select(...fields) {
                                                      result = result.map(item => {
                                                                const selected = {};

                                                                        for (const field of fields) {
                                                                                      selected[field] = item[field];
                                                                        }

                                                                                return selected;
                                                                    });

                                                                          return this;
                                                                },

                                                                    limit(count) {
                                                                              result = result.slice(0, Math.max(0, count));
                                                                                    return this;
                                                                    },

                                                                        execute() {
                                                                                  return result;
                                                                        }
                                                                    };
                                                                }

                                                                const output = query(employees)
                                                                  .where(employee => employee.salary > 50000)
                                                                    .orderBy("salary", "desc")
                                                                      .select("name", "salary")
                                                                        .limit(3)
                                                                          .execute();

                                                                          console.table(output);
                                                                          