import { Divider, Typography } from "@mui/material";

const PageTitle: React.FC<{ title: string }> = ({ title }) => (
    <>
        <Typography sx={{ fontWeight: 600, fontSize: "22px" }}>
            {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
    </>
);

export default PageTitle;