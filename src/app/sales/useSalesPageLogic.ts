import { useState, useCallback, useEffect } from "react";
import { updateSalesData } from "@/api/import";
import { showNotification } from "@/utils/notifications";
import { TabKey } from "@/types/sales";

export type Verification = {
  financial: boolean;
  card: boolean;
  category: boolean;
  otherCategory: boolean;
};



export function useSalesPageLogic(initialData: any = null) { 
  const [submitted, setSubmitted] = useState(!!initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("Sales");
  const [excelData, setAllData] = useState<any>(initialData);
  
  useEffect(() => {
    setAllData({data: initialData});
  }, [initialData]);

  

  const [verification, setVerification] = useState<Verification>({
    financial: false,
    card: false,
    category: false,
    otherCategory: false,
  });

  const isAllVerified = Object.values(verification).every(Boolean);

  const updateGroup = useCallback((key: string, value: any) => {
    setAllData((prev: any) => {
      const existingData = prev?.data || {};
      return {
        ...prev,
        data: {
          ...existingData,
          groups: {
            ...(existingData.groups || {}),
            [key]: value,
          },
        },
      };
    });
  }, []);

  const updateReport = async () => {
    if (!excelData?.data?._id) return;

    try {
      const updateResult = await updateSalesData(excelData.data._id, excelData.data);

      // Show success notification
      if (updateResult) {
          showNotification("Updated successfully",'success')  ;
      }
      // Redirect to sales page after a delay
      setTimeout(() => {
        window.location.href = "/sales"; // Use window.location.href instead of router.push
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error(err);

      // Show error notification
      showNotification("Update failed. Please try again.", "error");

    }
  };

  const handleVerifyChange = useCallback(
    (key: keyof Verification, value: boolean) => {
      setVerification((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleOtherCategoryUpdate = useCallback(
    (updatedData: any) => {
      updateGroup("exclusive_departments", updatedData);
    },
    [updateGroup]
  );

  return {
    submitted,
    setSubmitted,
    activeTab,
    setActiveTab,
    excelData,
    setAllData,
    verification,
    setVerification,
    isAllVerified,
    updateGroup,
    updateReport,
    handleVerifyChange,
    handleOtherCategoryUpdate,
  };
}
