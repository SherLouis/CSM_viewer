import { Box } from "@mantine/core"
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { useParams, Link } from 'react-router-dom'

export const ArticleDetailsPage = () => {
    const {articleId} = useParams<string>();
    return (
        <Box>
            <Breadcrumbs>
                <Anchor component={Link} title="Articles" to="/edit/sources">Articles</Anchor>
                <Text>{articleId}</Text>
            </Breadcrumbs>
            "TODO: Specific Article page: Reference infos (DOI, title, etc), Methodology infos (stimulation params) and results table. <br/>
            Breadcrumps, table with edit button for each entry, button to add result to table."
        </Box>
    )
}