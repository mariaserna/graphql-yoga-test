export default `
    enum TeamEnum {
        UI
        QA
        DESIGN
        ADMIN
    }
    type Project {
        id: ID!
        name: String!
        description: String
        team: TeamEnum!
    }
    type Query {
        project: Project!
        projects: [Project]!
    }
    type Mutation {
        createProject(name: String!, description: String, team: TeamEnum!): Project!
    }
`;
