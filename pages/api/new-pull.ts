import Cors from 'cors';
import initMiddleware from '../../utils/initMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { putter } from '../../lib/api/rest-client';
import env from '../../env';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with POST, PUT
    methods: ['POST', 'PUT'],
  })
);
const newPull = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await cors(req, res);
  // TODO: implement a way to name the new branch
  req.body = {
    title: 'Update Redirects title',
    head: 'a-new-branch',
    base: 'main',
  };
  const response = await putter(`/repos/${env.githubOwner}/${env.githubRepo}/pulls`, 'POST', req.body);
  let data = await response;

  const pullNumber = data.number;
  // const headSha = data.head.sha;

  // const body = {
  //   pull_number: pullNumber,
  //   commit_title: "commit title",
  //   commit_message: "new commit message",
  //   sha: "headSha", //SHA that pull request head must match to allow merge.
  //   merge_method: "merge", //Possible values are merge, squash or rebase. Default is merge
  // };

  data = await putter(`/repos/${env.githubOwner}/${env.githubRepo}/pulls/${pullNumber}/merge`, 'PUT', {});

  res.status(200).json({ data: data });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default newPull;
