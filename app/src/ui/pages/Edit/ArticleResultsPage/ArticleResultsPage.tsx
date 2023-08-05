import { Box } from "@mantine/core"
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { useParams, Link } from 'react-router-dom'

export const ArticleResultsPage = () => {
    const {articleId} = useParams<string>();
    return (
        <Box>
            <Breadcrumbs>
                <Anchor component={Link} title="Articles" to="/edit/sources">Articles</Anchor>
                <Text>{articleId}</Text>
            </Breadcrumbs>
            "TODO: Article results page. Breadcrumps, table with edit button for each entry, button to add result to table."
        </Box>
    )
}