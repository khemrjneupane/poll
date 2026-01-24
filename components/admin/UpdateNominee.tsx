"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Nominee {
  _id: string;
  name: string;
  surname: string;
  age: number;
  group: "party" | "independent";
  province: string;
  party?: string;
  address: {
    district: string;
    municipality: string;
    ward: string;
    tole: string;
  };
  avatar?: {
    url: string;
  };
}

// Hard-coded variables
const parties = [
  "Aam Aadmi Party Nepal",
  "Aam Janata Party",
  "Bahujan Ekata Party Nepal",
  "Bahujan Samaj Party Nepal",
  "Bahujan Shakti Party",
  "Bibeksheel Sajha Party",
  "Churebhavar Democratic Party",
  "CPN (Glorious)",
  "CPN UML (Unified Marxist-Leninist)",
  "CPN (Marxist)",
  "CPN (Marxist-Pushpalal)",
  "CPN (Maoist Centre)",
  "CPN (Maoist-Socialist)",
  "CPN (Socialist)",
  "CPN (Unified Socialist)",
  "CPN Unity National Campaign",
  "Democratic Party Nepal",
  "Democratic Socialist Party Nepal",
  "Patriotic Democratic Party Nepal",
  "Patriotic Society",
  "Federal Democratic National Forum",
  "Federal Development Party Nepal",
  "Federal Khumbuwan Democratic Party Nepal",
  "Federal Nepal Party",
  "Gandhian Party Nepal",
  "Hamro Nepali Party",
  "Historic Janata Party",
  "Inclusive Socialist Party Nepal",
  "Jan-Nationalist Party Nepal",
  "Jan Jagaran Party Nepal",
  "Janaprajatantrik Party Nepal",
  "Janata Janawadi Party Nepal",
  "Janata Progressive Party Nepal",
  "Janata Samajwadi Party Nepal",
  "Jana Samajwadi Party Nepal",
  "Janasewa Democratic Party",
  "Jai Janmabhumi Party Nepal",
  "Khumbuwan National Front Nepal",
  "Lok Dal",
  "Maulik Jarokilo Party",
  "Madhesi Terai Forum",
  "Madhesi Janaadhikar Forum-Madhes",
  "Maoist Communist Party Nepal",
  "Maoist Peoples Liberation Party Nepal",
  "Miteri Party Nepal",
  "Miteri Party Nepal",
  "Mongol National Organization",
  "Adhunik Nepal Socialist Party",
  "National Citizens Party",
  "National Development Party",
  "National Liberation Movement Nepal",
  "National Liberation Party Nepal",
  "National People-Oriented Democratic Party",
  "National Realist Party Nepal",
  "National Republic Nepal",
  "National Samata Party Nepal",
  "National Socialist Party Nepal",
  "National Unity Forum",
  "National Unity Party (Democratic)",
  "Nationalist Center Nepal",
  "Nationalist Peoples Party",
  "Nationalist Unity Party",
  "National Sadbhavana Party",
  "Nepal Bibeksheel Party",
  "Nepal Communist Party",
  "Nepal Communist Party (Democratic)",
  "Nepal Communist Party Parivartan",
  "Nepal Democratic Party",
  "Nepal Federal Socialist Party",
  "Nepal Inclusive Party",
  "Nepal Janamukti Party",
  "Nepal Janata Dal",
  "Nepal Janata Party",
  "Nepal Janajagruti Party",
  "Nepal Matrubhumi Party",
  "Nepal New Janawadi Party",
  "Nepal Nationalist Party",
  "Nepal Pariwar Dal",
  "Nepal Socialist Congress",
  "Nepal Socialist Party (Lohiyaist)",
  "Nepal Socialist Party (New Force)",
  "Nepal Workers Peasants Party",
  "Nepalism",
  "Nepali Congress",
  "Nepali Congress (BP)",
  "Nepali Greens Party",
  "Nepali for Nepal Party",
  "Nationalist Youth Front",
  "Parivartan Party",
  "Punarjagaran Party Nepal",
  "Progressive Democratic Party",
  "Progressive Socialist Party",
  "Rastriya Janata Party Nepal",
  "Rastriya Janamorcha",
  "Rastriya Matrubhumi Party",
  "Rastriya Prajatantra Party",
  "Rastriya Prajatantra Party Nepal",
  "Rastriya Sajha Party",
  "Rastriya Swatantra Party",
  "Shiv Sena Nepal",
  "Shram Sanskriti Party",
  "Sachet Nepali Party",
  "Social Democratic Party",
  "Socialist Center Nepal",
  "Socialist Party Nepal",
  "Terai-Madhes Democratic Party",
  "Trimul Nepal",
  "Ujyalo Nepal",
  "United Citizens Party",
  "United Nepal Democratic Party",
];

const provinces = [
  "Koshi - (Province 1)",
  "Madhesh - (Province 2)",
  "Bagmati - (Province 3)",
  "Gandaki - (Province 4)",
  "Lumbini - (Province 5)",
  "Karnali - (Province 6)",
  "Sudurpashchim - (Province 7)",
];

const districts = [
  { ne: "अछाम", en: "Achham" },
  { ne: "अर्घखाँची", en: "Arghakhanchi" },
  { ne: "बागलुंग", en: "Baglung" },
  { ne: "बैतडी", en: "Baitadi" },
  { ne: "बाँके", en: "Banke" },
  { ne: "बारा", en: "Bara" },
  { ne: "बाजुरा", en: "Bajura" },
  { ne: "बझाङ", en: "Bajhang" },
  { ne: "बर्दिया", en: "Bardiya" },
  { ne: "भक्तपुर", en: "Bhaktapur" },
  { ne: "भोजपुर", en: "Bhojpur" },
  { ne: "चितवन", en: "Chitwan" },
  { ne: "डडेल्धुरा", en: "Dadeldhura" },
  { ne: "दैलेख", en: "Dailekh" },
  { ne: "दाँग", en: "Dang" },
  { ne: "दार्चुला", en: "Darchula" },
  { ne: "धादिङ", en: "Dhading" },
  { ne: "धनकुटा", en: "Dhankuta" },
  { ne: "धनुषा", en: "Dhanusha" },
  { ne: "दोलखा", en: "Dolakha" },
  { ne: "डोल्पा", en: "Dolpa" },
  { ne: "डोटी", en: "Doti" },
  { ne: "गोरखा", en: "Gorkha" },
  { ne: "गुल्मी", en: "Gulmi" },
  { ne: "हुम्ला", en: "Humla" },
  { ne: "इलाम", en: "Ilam" },
  { ne: "जाजरकोट", en: "Jajarkot" },
  { ne: "झापा", en: "Jhapa" },
  { ne: "जुम्ला", en: "Jumla" },
  { ne: "कैलाली", en: "Kailali" },
  { ne: "कालिकोट", en: "Kalikot" },
  { ne: "कञ्चनपुर", en: "Kanchanpur" },
  { ne: "कपिलवस्तु", en: "Kapilvastu" },
  { ne: "कास्की", en: "Kaski" },
  { ne: "काठमाडौँ", en: "Kathmandu" },
  { ne: "काभ्रेपलाञ्चोक", en: "Kavrepalanchok" },
  { ne: "खोटाङ", en: "Khotang" },
  { ne: "ललितपुर", en: "Lalitpur" },
  { ne: "लमजुङ", en: "Lamjung" },
  { ne: "मकवानपुर", en: "Makwanpur" },
  { ne: "मनाङ", en: "Manang" },
  { ne: "मुगु", en: "Mugu" },
  { ne: "मुस्ताङ", en: "Mustang" },
  { ne: "म्याग्दी", en: "Myagdi" },
  { ne: "मोरङ", en: "Morang" },
  { ne: "नवलपुर", en: "Nawalpur" },
  { ne: "नुवाकोट", en: "Nuwakot" },
  { ne: "परासी", en: "Parasi" },
  { ne: "पर्वत", en: "Parbat" },
  { ne: "पञ्चथर", en: "Panchthar" },
  { ne: "पाल्पा", en: "Palpa" },
  { ne: "प्युठान", en: "Pyuthan" },
  { ne: "रोल्पा", en: "Rolpa" },
  { ne: "रुकुम पूर्व", en: "Rukum East" },
  { ne: "रुकुम पश्चिम", en: "Rukum West" },
  { ne: "रुपन्देही", en: "Rupandehi" },
  { ne: "रामाेछाप", en: "Ramechhap" },
  { ne: "रसुवा", en: "Rasuwa" },
  { ne: "रौतहट", en: "Rautahat" },
  { ne: "सल्यान", en: "Salyan" },
  { ne: "संखुवासभा", en: "Sankhuwasabha" },
  { ne: "सप्तरी", en: "Saptari" },
  { ne: "सिन्धुली", en: "Sindhuli" },
  { ne: "सिन्धुपाल्चोक", en: "Sindhupalchok" },
  { ne: "सिराहा", en: "Siraha" },
  { ne: "सोलुखुम्बु", en: "Solukhumbu" },
  { ne: "सुर्खेत", en: "Surkhet" },
  { ne: "स्याङ्जा", en: "Syangja" },
  { ne: "तनहुँ", en: "Tanahun" },
  { ne: "ताप्लेजुङ", en: "Taplejung" },
  { ne: "तेह्रथुम", en: "Terhathum" },
  { ne: "उदयपुर", en: "Udayapur" },
];
type UpdateNomineeProps = {
  nomineeId: string;
};
export default function UpdateNominee({ nomineeId }: UpdateNomineeProps) {
  //const params = useParams();
  //const router = useRouter();
  //const nomineeId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    age: "",
    group: "",
    province: "",
    party: "",
    district: "",
    municipality: "",
    ward: "",
    tole: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentNominee, setCurrentNominee] = useState<Nominee | null>(null);

  // Fetch current nominee data
  useEffect(() => {
    const fetchNominee = async () => {
      try {
        const response = await fetch(`/api/nominees/${nomineeId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched nominee data:", data);
          setCurrentNominee(data.data);
          setFormData({
            name: data.nominee.name || "",
            surname: data.nominee.surname || "",
            age: data.nominee.age?.toString() || "",
            group: data.nominee.group || "",
            province: data.nominee.province || "",
            party: data.nominee.party || "",
            district: data.nominee.address?.district || "",
            municipality: data.nominee.address?.municipality || "",
            ward: data.nominee.address?.ward?.toString() || "",
            tole: data.nominee.address?.tole || "",
          });
        }
      } catch (error) {
        console.error("Error fetching nominee:", error);
      }
    };

    if (nomineeId) {
      fetchNominee();
    }
  }, [nomineeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Form submission started...");
    console.log("Nominee ID:", nomineeId);

    try {
      const submitData = new FormData();

      // Add all fields that have values
      if (formData.name) submitData.append("name", formData.name);
      if (formData.surname) submitData.append("surname", formData.surname);
      if (formData.age) submitData.append("age", formData.age);
      if (formData.group) submitData.append("group", formData.group);
      if (formData.province) submitData.append("province", formData.province);
      if (formData.party) submitData.append("party", formData.party);
      if (formData.district) submitData.append("district", formData.district);
      if (formData.municipality)
        submitData.append("municipality", formData.municipality);
      if (formData.ward) submitData.append("ward", formData.ward);
      if (formData.tole) submitData.append("tole", formData.tole);
      if (avatarFile) submitData.append("avatar", avatarFile);

      // ✅ FIXED: Correct API endpoint URL
      const response = await fetch(`/api/nominees/${nomineeId}/update`, {
        method: "PATCH",
        body: submitData,
      });

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response data:", result);

      if (result.success) {
        setMessage("Nominee updated successfully!");
      } else {
        setMessage(`Error: ${result.error || "Unknown error"}`);
        if (result.details) {
          console.error("Validation errors:", result.details);
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("An error occurred while updating nominee");
    } finally {
      setLoading(false);
    }
  };

  if (!currentNominee) {
    return <div className="p-6">Loading nominee data...</div>;
  }

  return (
    <div className="z-101 w-full">
      <h1 className="text-2xl font-bold mb-6">Update Nominee</h1>

      {/* Current Data Display */}
      <div className="mb-6 p-4 bg-gray-100 rounded text-center">
        <h2 className="text-lg font-semibold mb-2">
          Update {currentNominee.name}
        </h2>
      </div>

      {/* Update Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xl text-slate-50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={currentNominee.name}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Surname</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder={currentNominee.surname}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder={currentNominee.age.toString()}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Group</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Group (optional)</option>
            <option value="party">Party</option>
            <option value="independent">Independent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Province</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option selected value="">
              {currentNominee.province}
            </option>
            {provinces.map((province, index) => (
              <option key={index} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {formData.group === "party" && (
          <div>
            <label className="block text-sm font-medium mb-1">Party</label>
            <select
              name="party"
              value={formData.party}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">{currentNominee.party}</option>
              {parties.map((party, index) => (
                <option key={index} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">{currentNominee.address.district}</option>
            {districts.map((district, index) => (
              <option key={index} value={district.ne}>
                {district.en}
              </option>
            ))}
          </select>
        </div>

        {/* <div>
          <label className="block text-sm font-medium mb-1">Municipality</label>
          <input
            type="text"
            name="municipality"
            value={formData.municipality}
            onChange={handleChange}
            placeholder={currentNominee.address.municipality}
            className="w-full p-2 border rounded"
          />
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Constitutional Area
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder="Constitutional Area Number"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1">Tole</label>
            <input
              type="text"
              name="tole"
              value={formData.tole}
              onChange={handleChange}
              placeholder={currentNominee.address.tole}
              className="w-full p-2 border rounded"
            />
          </div> */}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Avatar (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-600 mt-1">
            Leave empty to keep current Image
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-24 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Nominee"}
        </button>

        {message && (
          <div
            className={`p-3 rounded ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
