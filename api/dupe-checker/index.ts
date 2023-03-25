import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    if (!req.headers['content-length'] || parseInt(req.headers['Content-length']) > 10000 || !context.req.body) {
        context.res = {
            status: 403
        }
        return;
    }

    let dupeEtags = new Set();
    let dupeUrls: string[] = [];
    let urlsToCheck: string[] = context.req.body.urls;

    await Promise.all(urlsToCheck.map(async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const etag = response.headers.get("etag");
            if (etag) {
                if (dupeEtags.has(etag)) {
                    dupeUrls.push(url);
                } else {
                    dupeEtags.add(etag);
                }
            };
        } catch (error) {
            console.log(error);
        }
    }));

    context.res = {
        status: 200,
        body: dupeUrls,
        headers: { "Content-Type": "application/json" }
    }
};


export default httpTrigger;