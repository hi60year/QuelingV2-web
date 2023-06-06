import {TeamStatus} from "../../../__generated__/graphql.ts";
import {grey, yellow} from "@mui/material/colors";
import {Box} from "@mui/material";

export default function StatusBadge(props: {status: TeamStatus}) {

    let color = ''
    let text = ''

    switch (props.status) {
        case TeamStatus.Editing:
            color = grey[500]
            text = '编辑中'
            break
        case TeamStatus.Accepted:
            color = 'green'
            text = '通过'
            break
        case TeamStatus.Pending:
            color = yellow[700]
            text = '审核中'
            break
        case TeamStatus.Rejected:
            color = 'red'
            text = '拒绝'
            break
    }

    return <Box sx={{backgroundColor: color, fontSize: "12px", py:"3px", px: "10px", borderRadius: "5px", color: 'white'}}>
        {text}
    </Box>
}