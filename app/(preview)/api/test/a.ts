export default function handler(req, res) {
    res.json({ workflowUrl: process.env.NEXT_PUBLIC_WORKFLOW });
  }
  