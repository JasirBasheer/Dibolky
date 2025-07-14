import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { SidebarTrigger } from "./sidebar";
import { Separator } from "./separator"; 
type BreadCrumb = [string, string];

const CustomBreadCrumbs = ({ breadCrumbs }: { breadCrumbs: BreadCrumb[] }) => {
  return (
    <>
<header className="sticky top-0 z-50 flex border-b h-16 shrink-0 items-center gap-2 bg-[#fafafa] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 "
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadCrumbs.map((crumb, index) => {
                return breadCrumbs.length - 1 == index ? (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbPage>{crumb[0]}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={`${crumb[1]}`}>
                        {crumb[0]}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />{" "}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    </>
  );
};

export default CustomBreadCrumbs;
