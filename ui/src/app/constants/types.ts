interface gallery_data {
    items: { media_id: string; }[]
}


export interface UserPostDetails {
    domain: string;
    url: string;
    author: string;
    thumbnail: string;
    subreddit: string;
    post_hint?: string;
    is_gallery?: boolean;
    gallery_data?: gallery_data
}

export enum PostKind {
    t3
}

export interface UserPost {
    kind: PostKind;
    data: UserPostDetails;
}

export interface UserSubmittedData {
    data: {
        after: string | null;
        before: string | null;
        children: UserPost[];
    }
}

export type userPostType = 'self' | 'imgur-gifv' | 'image' | 'redgif' | 'gallery' | undefined;

export interface UserAboutData {
    data: {
        subreddit : {
            display_name_prefixed : string;
            title: string;
            public_description: string;
            banner_img :  string;
        },
        icon_img: string;
        name : string;
    }
}
