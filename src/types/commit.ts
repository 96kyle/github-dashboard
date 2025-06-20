export interface Commit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    url: string;
    comment_count: number;
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  } | null;
  committer: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  } | null;
  parents: Array<{
    sha: string;
    url: string;
    html_url: string;
  }>;
}
