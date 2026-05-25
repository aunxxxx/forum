export const currentUser = {
    name: "练习生001",
    role: "trainee" // ⭐ 只有 trainee 才能发帖
};

export const posts = [
    {
        id: "p1",
        user: "李",
        name: "李四",
        role: "trainee",
        content: "第一位认证用户报到！大家好啊！",
        image: "",
        likes: 10,
        comments: 0,
        time: "刚刚",
        likedBy: [
            { id: "u1", name: "马睿婕", title: "创始", avatar: "https://i.pravatar.cc/40?img=3", count: 3 }
        ]
    },
    {
        id: "p2",
        user: "张",
        name: "张三",
        role: "trainee",
        content: "契弟广场终于开了，开心！",
        image: "",
        likes: 2,
        comments: 0,
        time: "刚刚",
        likedBy: []
    }
];
