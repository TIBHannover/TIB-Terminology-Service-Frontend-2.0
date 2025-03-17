type BaseCommit = {
    sha: string;
    web_url: string;
}

type GithubCommit = BaseCommit & {
    uri: string;
    commitDetail: CommitDetail;
    parents: Array<ParentCommit>;
}

type CommitDetail = {
    committer: {
        name: string;
        date: Date;
    };
    message: string;
}

type ParentCommit = {
    uri: string;
    sha: string;
}

type GitlabCommit = BaseCommit & {
    message: string;
    committed_date: Date;
    parent_ids: Array<string>;
}

type Commit = GithubCommit | GitlabCommit;
