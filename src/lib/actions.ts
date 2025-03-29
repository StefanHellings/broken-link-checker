'use server';

// This is a mock implementation for demo purposes
// In a real application, you would implement actual web crawling logic here
export async function crawlWebsite(url: string) {
    // Simulate a delay to mimic crawling
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate some mock results
    const mockResults = [
        {
            url: `${url}/about`,
            sourceUrl: url,
            status: 200,
            ok: true,
        },
        {
            url: `${url}/products`,
            sourceUrl: url,
            status: 200,
            ok: true,
        },
        {
            url: `${url}/contact`,
            sourceUrl: url,
            status: 200,
            ok: true,
        },
        {
            url: `${url}/blog/post-1`,
            sourceUrl: `${url}/blog`,
            status: 200,
            ok: true,
        },
        {
            url: `${url}/blog/post-2`,
            sourceUrl: `${url}/blog`,
            status: 404,
            ok: false,
        },
        {
            url: `${url}/old-page`,
            sourceUrl: `${url}/about`,
            status: 404,
            ok: false,
        },
        {
            url: 'https://external-site.com/resource',
            sourceUrl: `${url}/resources`,
            status: 500,
            ok: false,
        },
        {
            url: 'https://partner-site.com',
            sourceUrl: `${url}/partners`,
            status: 200,
            ok: true,
        },
        {
            url: 'https://broken-external.com',
            sourceUrl: `${url}/partners`,
            status: 404,
            ok: false,
        },
    ];

    return mockResults;
}
