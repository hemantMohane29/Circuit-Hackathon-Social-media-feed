(() => {
    const commentsListElem = document.getElementById('comments-list');
    const newCommentElem = document.getElementById('new-comment');
    const submitCommentBtn = document.getElementById('submit-comment');

    let comments = [];

    // Enable submit button only if text is present
    newCommentElem.addEventListener('input', () => {
        submitCommentBtn.disabled = newCommentElem.value.trim().length === 0;
    });

    // Render function (recursive for replies)
    function renderComments() {
        commentsListElem.innerHTML = '';
        comments.forEach((comment, idx) => {
            commentsListElem.appendChild(createCommentElement(comment, idx));
        });
    }

    function createCommentElement(comment, idx) {
        const commentElem = document.createElement('article');
        commentElem.classList.add('comment');
        commentElem.setAttribute('data-idx', idx);
        commentElem.setAttribute('aria-label', `Comment by ${comment.author}`);

        const headerElem = document.createElement('header');
        headerElem.classList.add('comment-header');
        headerElem.textContent = comment.author;

        const textElem = document.createElement('div');
        textElem.classList.add('comment-text');
        textElem.textContent = comment.text;

        // Actions container
        const actionsElem = document.createElement('section');
        actionsElem.classList.add('comment-actions');

        // Like button
        const likeBtn = document.createElement('button');
        likeBtn.className = comment.liked ? 'liked' : '';
        likeBtn.innerHTML = `👍 ${comment.likes}`;
        likeBtn.setAttribute('aria-pressed', comment.liked);
        likeBtn.addEventListener('click', () => {
            comment.liked = !comment.liked;
            comment.likes += comment.liked ? 1 : -1;
            renderComments();
        });

        // Reply button
        const replyBtn = document.createElement('button');
        replyBtn.textContent = 'Reply';
        replyBtn.setAttribute('aria-expanded', 'false');

        actionsElem.appendChild(likeBtn);
        actionsElem.appendChild(replyBtn);

        commentElem.appendChild(headerElem);
        commentElem.appendChild(textElem);
        commentElem.appendChild(actionsElem);

        // Reply input box container (hidden initially)
        const replyBox = document.createElement('div');
        replyBox.classList.add('reply-box');
        replyBox.style.display = 'none';

        const replyInput = document.createElement('textarea');
        replyInput.classList.add('reply-input');
        replyInput.placeholder = `Reply to ${comment.author}...`;
        replyInput.rows = 3;

        const replySubmit = document.createElement('button');
        replySubmit.classList.add('reply-submit');
        replySubmit.textContent = 'Post Reply';
        replySubmit.disabled = true;

        replyInput.addEventListener('input', () => {
            replySubmit.disabled = replyInput.value.trim().length === 0;
        });

        replySubmit.addEventListener('click', () => {
            const val = replyInput.value.trim();
            if (!val) return;

            if (!comment.replies) comment.replies = [];
            comment.replies.push({
                author: 'You',
                text: val,
                likes: 0,
                liked: false,
                replies: []
            });

            replyInput.value = '';
            replySubmit.disabled = true;
            replyBox.style.display = 'none';
            replyBtn.setAttribute('aria-expanded', 'false');

            renderComments();
        });

        replyBox.appendChild(replyInput);
        replyBox.appendChild(replySubmit);
        commentElem.appendChild(replyBox);

        replyBtn.addEventListener('click', () => {
            const isVisible = replyBox.style.display === 'block';
            replyBox.style.display = isVisible ? 'none' : 'block';
            replyBtn.setAttribute('aria-expanded', !isVisible);
            if (!isVisible) replyInput.focus();
        });

        // Render replies recursively
        if (comment.replies && comment.replies.length > 0) {
            const repliesContainer = document.createElement('section');
            repliesContainer.classList.add('replies-list');
            comment.replies.forEach(reply => {
                const replyElem = document.createElement('article');
                replyElem.classList.add('reply');
                replyElem.setAttribute('aria-label', `Reply by ${reply.author}`);

                const replyHeader = document.createElement('header');
                replyHeader.classList.add('reply-header');
                replyHeader.textContent = reply.author;

                const replyText = document.createElement('div');
                replyText.classList.add('reply-text');
                replyText.textContent = reply.text;

                replyElem.appendChild(replyHeader);
                replyElem.appendChild(replyText);
                repliesContainer.appendChild(replyElem);
            });

            commentElem.appendChild(repliesContainer);
        }

        return commentElem;
    }

    submitCommentBtn.addEventListener('click', () => {
        const val = newCommentElem.value.trim();
        if (!val) return;

        comments.push({
            author: 'You',
            text: val,
            likes: 0,
            liked: false,
            replies: []
        });

        newCommentElem.value = '';
        submitCommentBtn.disabled = true;
        renderComments();
    });


    // Add some example comment to start
    comments.push({
        author: 'Hemant Mohane',
        text: 'Welcome to the professional comment feed demo!',
        likes: 5,
        liked: false,
        replies: [
            {
                author: 'Bob',
                text: 'Thanks Hemant Mohane, great to be here!',
                likes: 2,
                liked: false,
                replies: []
            }
        ]
    });

    renderComments();
})();
  