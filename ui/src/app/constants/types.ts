
export interface UserPost {
    url: string;
    author: string;
    thumbnail: string;
    subreddit: string;
    post_hint: string;
}

export enum PostKind {
    t3
}

export interface UserSubmittedData {
    data: {
        after: string | null;
        before: string | null;
        children: [{
            kind: PostKind;
            data: UserPost;
        }]
    }
}

