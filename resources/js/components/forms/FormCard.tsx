import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FormCardProps {
  title: string;
  description?: string;
  width?: string;
  children: React.ReactNode;
  toggleUI?: React.ReactNode;
  footerButtons?: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  description,
  width = "w-full",
  children,
  toggleUI,
  footerButtons,
}) => {
  return (
    <Card className={`${width} border-2 border-gray-200`}>
      <CardHeader>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div>{toggleUI}</div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {footerButtons && <div className="mt-4">{footerButtons}</div>}
      </CardContent>
    </Card>
  );
};

export default FormCard;
