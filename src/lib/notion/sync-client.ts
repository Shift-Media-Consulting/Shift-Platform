// Notion sync stub — replace with real implementation when NOTION_API_KEY is configured

export async function syncClientToNotion(clientData: {
  company_name: string
  client_id: string
  sector: string
  client_type: string
  main_contact: string
  email: string
}): Promise<{ notion_id: string } | { error: string }> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.log('[Notion stub] Would sync client:', clientData.company_name)
    return { notion_id: 'stub-' + Date.now() }
  }
  // Real implementation — wire up when Notion credentials are available
  try {
    const { Client } = await import('@notionhq/client')
    const notion = new Client({ auth: process.env.NOTION_API_KEY })
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: clientData.company_name } }] },
        'Client ID': { rich_text: [{ text: { content: clientData.client_id } }] },
        Sector: { select: { name: clientData.sector } },
        Type: { select: { name: clientData.client_type } },
        Contact: { rich_text: [{ text: { content: clientData.main_contact } }] },
        Email: { email: clientData.email },
      },
    })
    return { notion_id: response.id }
  } catch (err) {
    console.error('[Notion] Sync failed:', err)
    return { error: 'Notion sync failed' }
  }
}

export async function syncProjectToNotion(projectData: {
  project_name: string
  project_id: string
  client_name: string
  status: string
}): Promise<{ notion_id: string } | { error: string }> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_PROJECTS_DATABASE_ID) {
    console.log('[Notion stub] Would sync project:', projectData.project_name)
    return { notion_id: 'stub-' + Date.now() }
  }
  try {
    const { Client } = await import('@notionhq/client')
    const notion = new Client({ auth: process.env.NOTION_API_KEY })
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_PROJECTS_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: projectData.project_name } }] },
        'Project ID': { rich_text: [{ text: { content: projectData.project_id } }] },
        Client: { rich_text: [{ text: { content: projectData.client_name } }] },
        Status: { select: { name: projectData.status } },
      },
    })
    return { notion_id: response.id }
  } catch (err) {
    console.error('[Notion] Sync failed:', err)
    return { error: 'Notion sync failed' }
  }
}
