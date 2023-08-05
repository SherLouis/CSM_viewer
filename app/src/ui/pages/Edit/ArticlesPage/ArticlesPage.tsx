import { Box, NavLink } from "@mantine/core"
import {Link} from "react-router-dom"

export const ArticlesPage = () => {
    return (
        <Box>
            "TODO: Articles page. Breadcrumps, table with edit button for each entry, button to add article to table."
            <NavLink component={Link} to='/edit/sources/someId/results' label='Go to Article Results Page'/>
        </Box>
    )
}