export type GitHubIssueJson = {
    title: string;
    labels: {
        name: string;
        color: string;
        url: string;
    }[];
    number: number;
    created_at: string;
    user: {
        login: string;
    };
}
