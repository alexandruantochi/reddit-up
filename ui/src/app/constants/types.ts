export interface UserPostDetails {
    domain: string;
    url: string;
    author: string;
    thumbnail: string;
    subreddit: string;
    post_hint: string;
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

export interface UserAboutData {
    data: {
        accept_chats: boolean;
        accept_followers: boolean;
        accept_pms: boolean;
        awardee_karma: number;
        awarder_karma: number;
        comment_karma: number;
        created: number;
        created_utc: number;
        has_subscribed: boolean;
        has_verified_email: boolean;
        hide_from_robots: boolean;
        icon_img: string;
        id: string;
        is_blocked: boolean;
        is_employee: boolean;
        is_friend: boolean;
        is_gold: boolean;
        is_mod: boolean;
        link_karma: number;
        name: string;
        pref_show_snoovatar: boolean;
        snoovatar_img: string;
        snoovatar_size: [number, number] | null;
        subreddit: {
            accept_followers: boolean;
            allowed_media_in_comments: []
            banner_img: string;
            banner_size: [number, number] | null;
            community_icon: null
            default_set: boolean;
            description: string;
            disable_contributor_requests: boolean;
            display_name: string;
            display_name_prefixed: string;
            free_form_reports: boolean;
            header_img: string | null
            header_size: [number, number] | null;
            icon_color: string;
            icon_img: string;
            icon_size: [number, number] | null;
            is_default_banner: boolean;
            is_default_icon: boolean;
            key_color: string;
            link_flair_enabled: boolean;
            link_flair_position: string;
            name: string;
            over_18: boolean;
            previous_names: [];
            primary_color: string;
            public_description: string;
            quarantine: boolean;
            restrict_commenting: boolean;
            restrict_posting: boolean;
            show_media: boolean;
            submit_link_label: string;
            submit_text_label: string;
            subreddit_type: string;
            subscribers: number;
            title: string;
            url: string;
            user_is_banned: boolean;
            user_is_contributor: boolean;
            user_is_moderator: boolean;
            user_is_muted: any;
            user_is_subscriber: boolean;
        }
        total_karma: number;
        verified: boolean;
    }
    kind: string;
}
